# API Documentation

The Street Support Platform Web provides a comprehensive REST API for accessing services, organisations, and location data. All endpoints are publicly accessible and designed for integration with external systems.

## Base URL

```
https://streetsupport.net/api
```

For local development:
```
http://localhost:3000/api
```

---

## Response Format

All API endpoints return JSON with a consistent structure:

### Success Response
```json
{
  "status": "success",
  "total": 150,
  "count": 10,
  "data": [...],
  "error": null
}
```

### Error Response  
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## Available Endpoints

### 📍 **Service Discovery**

#### `GET /api/services`
Find services by location and filters.

**Query Parameters:**
- `lat` (number, required): Latitude coordinate
- `lng` (number, required): Longitude coordinate  
- `radius` (number, optional): Search radius in miles (default: 5)
- `limit` (number, optional): Maximum results (default: 50, max: 500)
- `category` (string, optional): Filter by parent category key
- `subCategory` (string, optional): Filter by subcategory key
- `clientGroup` (string, optional): Filter by target demographic
- `openNow` (boolean, optional): Only show currently open services

**Example Request:**
```bash
GET /api/services?lat=53.4808&lng=-2.2426&radius=10&category=meals&limit=20
```

**Example Response:**
```json
{
  "status": "success",
  "total": 45,
  "count": 20,
  "data": [
    {
      "_id": "service123",
      "ServiceProviderName": "Manchester Food Bank",
      "Info": "Free food parcels for families in need",
      "ParentCategoryKey": "meals",
      "SubCategoryKey": "food-parcels",
      "ServiceProviderKey": "manchester-food-bank",
      "Address": {
        "Street": "123 High Street",
        "City": "Manchester", 
        "Postcode": "M1 1AA",
        "Location": {
          "coordinates": [-2.2426, 53.4808]
        }
      },
      "OpeningTimes": [
        { "Day": 1, "StartTime": 900, "EndTime": 1700 },
        { "Day": 3, "StartTime": 900, "EndTime": 1700 }
      ],
      "ClientGroups": ["families", "adults"],
      "distance": 0.8
    }
  ]
}
```

---

### 🏢 **Organisation Data**

#### `GET /api/service-providers`
List all service providers/organisations.

**Query Parameters:**
- `limit` (number, optional): Maximum results (default: 50)
- `verified` (boolean, optional): Filter by verification status

**Example Response:**
```json
{
  "status": "success", 
  "total": 120,
  "count": 50,
  "data": [
    {
      "_id": "org123",
      "Key": "manchester-food-bank",
      "Name": "Manchester Food Bank",
      "ShortDescription": "Supporting families in crisis",
      "IsVerified": true,
      "IsPublished": true,
      "Website": "https://manchesterfoodbank.org"
    }
  ]
}
```

#### `GET /api/service-providers/[slug]`
Get detailed organisation information.

**Parameters:**
- `slug` (string, required): Organisation slug/key

**Query Parameters:**
- `lat` (number, optional): User latitude for distance calculations
- `lng` (number, optional): User longitude for distance calculations  
- `radius` (number, optional): Filter services by radius

**Example Response:**
```json
{
  "status": "success",
  "organisation": {
    "key": "manchester-food-bank",
    "name": "Manchester Food Bank",
    "shortDescription": "Supporting families in crisis", 
    "description": "Detailed organisation description...",
    "website": "https://manchesterfoodbank.org",
    "telephone": "0161 123 4567",
    "email": "contact@manchesterfoodbank.org",
    "addresses": [
      {
        "Street": "123 High Street",
        "City": "Manchester",
        "Postcode": "M1 1AA",
        "Location": { "coordinates": [-2.2426, 53.4808] }
      }
    ]
  },
  "services": [
    {
      "_id": "service123",
      "ParentCategoryKey": "meals",
      "SubCategoryKey": "food-parcels",
      "Info": "Free food parcels",
      "OpeningTimes": [...],
      "ClientGroups": ["families"]
    }
  ],
  "userContext": {
    "lat": 53.4808,
    "lng": -2.2426,
    "radius": 5,
    "location": null
  }
}
```

---

### 📂 **Categories & Classifications**

#### `GET /api/categories`
Get service category taxonomy.

**Example Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "cat1",
      "Key": "meals",
      "Name": "Food & Drink",
      "Synopsis": "Food provision services",
      "SubCategories": [
        {
          "Key": "breakfast",
          "Name": "Breakfast"
        },
        {
          "Key": "food-parcels", 
          "Name": "Food Parcels"
        }
      ]
    }
  ]
}
```

#### `GET /api/client-groups`
Get target demographic classifications.

**Example Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "group1",
      "Key": "adults",
      "Name": "Adults"
    },
    {
      "_id": "group2", 
      "Key": "families",
      "Name": "Families with Children"
    }
  ]
}
```

---

### 📍 **Location Services**

#### `GET /api/locations`
Get available location areas.

**Example Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "loc1",
      "Key": "manchester",
      "Name": "Manchester",
      "Latitude": 53.4808,
      "Longitude": -2.2426,
      "IsPublished": true
    }
  ]
}
```

#### `GET /api/geocode`
Convert postcode to coordinates.

**Query Parameters:**
- `postcode` (string, required): UK postcode to geocode

**Example Request:**
```bash
GET /api/geocode?postcode=M1%201AA
```

**Example Response:**
```json
{
  "status": "success",
  "location": {
    "lat": 53.4808,
    "lng": -2.2426
  },
  "postcode": "M1 1AA"
}
```

**Error Response (Invalid Postcode):**
```json
{
  "status": "error",
  "message": "Invalid postcode format"
}
```

---

### 📊 **Platform Statistics**

#### `GET /api/stats`
Get platform usage statistics.

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "totalServices": 1250,
    "totalOrganisations": 340,
    "totalLocations": 25,
    "lastUpdated": "2024-08-04T10:30:00Z"
  }
}
```

#### `GET /api/faqs`
Get frequently asked questions.

**Example Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "faq1",
      "Question": "How do I add my organisation?",
      "Answer": "You can add your organisation by...",
      "Category": "getting-started"
    }
  ]
}
```

---

## Error Handling

The API uses standard HTTP status codes:

- **200 OK**: Request successful
- **400 Bad Request**: Invalid parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Common error scenarios:

### Invalid Coordinates
```json
{
  "status": "error", 
  "message": "Invalid coordinates provided"
}
```

### Missing Required Parameters
```json
{
  "status": "error",
  "message": "Missing required parameter: lat"
}
```

### Service Unavailable
```json
{
  "status": "error",
  "message": "Service temporarily unavailable"
}
```

---

## Rate Limiting

- **Standard Rate Limit**: 100 requests per minute per IP
- **Burst Allowance**: Up to 20 requests in 10 seconds
- **Headers**: Rate limit status included in response headers

When rate limited:
```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later."
}
```

---

## Data Freshness

- **Service Data**: Updated every 15 minutes
- **Organisation Data**: Updated every 30 minutes  
- **Location Data**: Updated daily
- **Categories**: Updated weekly

---

## Integration Examples

### Find Services Near Location
```javascript
const response = await fetch(
  '/api/services?lat=53.4808&lng=-2.2426&radius=10&category=meals'
);
const { data } = await response.json();
console.log(`Found ${data.length} meal services`);
```

### Get Organisation Details
```javascript
const response = await fetch('/api/service-providers/manchester-food-bank');
const { organisation, services } = await response.json();
console.log(`${organisation.name} offers ${services.length} services`);
```

### Geocode Postcode
```javascript
const response = await fetch('/api/geocode?postcode=M1%201AA');
const { location } = await response.json();
console.log(`Coordinates: ${location.lat}, ${location.lng}`);
```

---

## Support

For API support and questions:
- **Documentation Issues**: Create an issue on GitHub
- **Integration Help**: Contact the development team
- **Bug Reports**: Use the GitHub issue tracker

---

**Last Updated**: August 2024  
**API Version**: 1.0  
**Status**: Production Ready ✅