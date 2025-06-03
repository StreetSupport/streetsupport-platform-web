const L = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    addLayer: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  Icon: {
    Default: function () {}
  }
};

L.Icon.Default.prototype = {
  _getIconUrl: jest.fn()
};

L.Icon.Default.mergeOptions = jest.fn();

module.exports = L;
module.exports.default = L;
