interface MapMarker {
  lat: number;
  lng: number;
  id: string;
  type?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface BoundsResult {
  bounds: google.maps.LatLngBounds | null;
  shouldFit: boolean;
  recommendedZoom?: number;
}

interface BoundsOptions {
  includeUserLocation?: boolean;
  maxZoom?: number;
  minZoom?: number;
  paddingPercent?: number;
  maxDistanceKm?: number;
}

/**
 * Calculate optimal bounds for a set of markers and optional user location
 */
export function calculateMapBounds(
  markers: MapMarker[],
  userLocation?: UserLocation | null,
  options: BoundsOptions = {}
): BoundsResult {
  const {
    includeUserLocation = true,
    maxZoom = 16,
    maxDistanceKm = 50
  } = options;

  // Filter out user location markers from the marker list to avoid duplication
  const serviceMarkers = markers.filter(marker => 
    marker.type !== 'user' && marker.id !== 'user-location'
  );

  // If no service markers, handle edge cases
  if (serviceMarkers.length === 0) {
    if (userLocation && includeUserLocation) {
      // Only user location - return centered on user with default zoom
      return {
        bounds: null,
        shouldFit: false,
        recommendedZoom: 13
      };
    }
    // No markers at all
    return {
      bounds: null,
      shouldFit: false
    };
  }

  // Create bounds object
  if (typeof google === 'undefined' || !google.maps) {
    return {
      bounds: null,
      shouldFit: false
    };
  }

  const bounds = new google.maps.LatLngBounds();

  // Add all service markers to bounds
  serviceMarkers.forEach(marker => {
    bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
  });

  // Decide whether to include user location
  let shouldIncludeUser = false;
  if (userLocation && includeUserLocation) {
    // Check if user location is within reasonable distance of service markers
    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    
    // Find closest marker to user
    let minDistance = Infinity;
    serviceMarkers.forEach(marker => {
      const markerLatLng = new google.maps.LatLng(marker.lat, marker.lng);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, markerLatLng) / 1000; // km
      minDistance = Math.min(minDistance, distance);
    });

    // Include user location if it's within maxDistanceKm of the closest marker
    shouldIncludeUser = minDistance <= maxDistanceKm;
    
    if (shouldIncludeUser) {
      bounds.extend(userLatLng);
    }
  }

  // Handle single marker case
  if (serviceMarkers.length === 1 && !shouldIncludeUser) {
    return {
      bounds: null,
      shouldFit: false,
      recommendedZoom: Math.min(maxZoom, 14) // Reasonable zoom for single marker
    };
  }

  return {
    bounds,
    shouldFit: true
  };
}

/**
 * Apply bounds to a Google Map instance with appropriate padding and zoom limits
 */
export function fitMapToBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  options: BoundsOptions = {}
): void {
  const {
    maxZoom = 16,
    minZoom = 8,
    paddingPercent = 0.1
  } = options;

  if (!bounds || bounds.isEmpty()) {
    return;
  }

  // Calculate padding based on map container size
  const mapDiv = map.getDiv();
  const containerWidth = mapDiv.offsetWidth;
  const containerHeight = mapDiv.offsetHeight;
  
  const padding = {
    top: Math.max(20, containerHeight * paddingPercent),
    right: Math.max(20, containerWidth * paddingPercent),
    bottom: Math.max(20, containerHeight * paddingPercent),
    left: Math.max(20, containerWidth * paddingPercent)
  };

  // Fit the bounds with padding
  map.fitBounds(bounds, padding);

  // Apply zoom constraints after fitting
  google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
    const currentZoom = map.getZoom();
    if (currentZoom !== undefined) {
      if (currentZoom > maxZoom) {
        map.setZoom(maxZoom);
      } else if (currentZoom < minZoom) {
        map.setZoom(minZoom);
      }
    }
  });
}

/**
 * Update map bounds based on markers and user location
 */
export function updateMapBounds(
  map: google.maps.Map,
  markers: MapMarker[],
  userLocation?: UserLocation | null,
  options: BoundsOptions = {}
): void {
  const result = calculateMapBounds(markers, userLocation, options);
  
  if (result.shouldFit && result.bounds) {
    fitMapToBounds(map, result.bounds, options);
  } else if (result.recommendedZoom) {
    // Handle single marker or user-only cases
    let center: google.maps.LatLng | undefined;
    
    if (markers.length === 1) {
      const marker = markers[0];
      center = new google.maps.LatLng(marker.lat, marker.lng);
    } else if (userLocation) {
      center = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    }
    
    if (center) {
      map.setCenter(center);
      map.setZoom(result.recommendedZoom);
    }
  }
}

/**
 * Check if two sets of markers are different enough to warrant bounds recalculation
 */
export function shouldRecalculateBounds(
  oldMarkers: MapMarker[],
  newMarkers: MapMarker[],
  _threshold: number = 0.001 // ~100m tolerance
): boolean {
  // Different number of markers = recalculate
  if (oldMarkers.length !== newMarkers.length) {
    return true;
  }

  // Compare marker positions (simple coordinate comparison)
  const oldSet = new Set(oldMarkers.map(m => `${m.lat.toFixed(6)},${m.lng.toFixed(6)}`));
  const newSet = new Set(newMarkers.map(m => `${m.lat.toFixed(6)},${m.lng.toFixed(6)}`));
  
  // If sets are different, recalculate
  if (oldSet.size !== newSet.size) {
    return true;
  }
  
  for (const coord of oldSet) {
    if (!newSet.has(coord)) {
      return true;
    }
  }
  
  return false;
}