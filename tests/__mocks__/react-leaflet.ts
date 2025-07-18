// Mock for react-leaflet
module.exports = {
  MapContainer: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  TileLayer: jest.fn().mockImplementation(() => <div />),
  Marker: jest.fn().mockImplementation(() => <div />),
  Popup: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
  useMap: jest.fn(),
};