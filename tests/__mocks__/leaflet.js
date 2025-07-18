// Mock for leaflet
module.exports = {
  map: jest.fn(),
  marker: jest.fn(),
  tileLayer: jest.fn(),
  icon: jest.fn(),
  latLng: jest.fn(),
  divIcon: jest.fn(),
  point: jest.fn(),
  control: {
    layers: jest.fn(),
  },
  layerGroup: jest.fn(),
};