// Enhanced mock for JSON imports
// This mock dynamically handles JSON imports and provides default values
module.exports = new Proxy(
  // Create a mock array with array methods
  Object.assign([], {
    default: [
      {
        key: 'foodbank',
        name: 'Food',
        subCategories: [
          { key: 'general', name: 'Food Banks' },
          { key: 'meals', name: 'Meals' }
        ]
      },
      {
        key: 'health',
        name: 'Health',
        subCategories: [
          { key: 'dentist', name: 'Dentist' },
          { key: 'gp', name: 'GP' }
        ]
      },
      {
        key: 'housing',
        name: 'Housing',
        subCategories: [
          { key: 'emergency', name: 'Emergency' },
          { key: 'hostel', name: 'Hostels' }
        ]
      }
    ],
    // Add other common JSON structures
    locations: [
      { key: 'manchester', name: 'Manchester' },
      { key: 'leeds', name: 'Leeds' }
    ],
    categories: [
      { key: 'health', name: 'Health' },
      { key: 'housing', name: 'Housing' }
    ],
    clientGroups: [
      { key: 'adults', name: 'Adults' },
      { key: 'families', name: 'Families' }
    ],
    serviceProviders: [
      { 
        key: 'test-provider',
        name: 'Test Provider',
        description: 'A test service provider'
      }
    ]
  }),
  {
    get(target, prop) {
      // Handle array index access
      if (!isNaN(Number(prop))) {
        return target.default[Number(prop)];
      }
      
      // Handle array length
      if (prop === 'length') {
        return target.default.length;
      }
      
      // Handle array methods
      if (prop === 'map' || prop === 'filter' || prop === 'find' || prop === 'sort') {
        return target.default[prop].bind(target.default);
      }
      
      // Handle default export
      if (prop === 'default') {
        return target.default;
      }
      
      // Return other properties
      return target[prop];
    }
  }
);