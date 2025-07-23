// Mock for rehype-raw to avoid ESM issues in Jest
module.exports = function rehypeRaw() {
  // Mock function that returns a no-op transformer
  return function transformer() {
    // No-op transformer for tests
    return;
  };
};