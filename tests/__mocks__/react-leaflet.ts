// Mock for react-leaflet
module.exports = {
  MapContainer: jest.fn().mockImplementation(({ children }) => children),
  TileLayer: jest.fn().mockImplementation(() => null),
  Marker: jest.fn().mockImplementation(() => null),
  Popup: jest.fn().mockImplementation(({ children }) => children),
  useMap: jest.fn(),
};