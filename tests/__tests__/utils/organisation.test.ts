import { getOrganisationBySlug } from '@/utils/organisation';
import { 
  mockFetchSuccess, 
  mockFetchNotFound, 
  mockFetchServerError, 
  mockFetchNetworkError,
  mockFetchMinimalSuccess,
  mockFetchTimeout,
  mockFetchValidationError,
  resetFetchMock,
  mockOrganisationDetails,
  mockMinimalOrganisationDetails
} from '../../__mocks__/api-responses';

describe('getOrganisationBySlug', () => {
  beforeEach(() => {
    // Set up environment variable needed for the tests
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
    resetFetchMock();
  });

  afterEach(() => {
    // Clean up
    jest.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('should return organisation details when fetch is successful', async () => {
    // Arrange
    mockFetchSuccess();
    
    // Act
    const result = await getOrganisationBySlug('test-org');
    
    // Assert
    expect(result).toEqual(mockOrganisationDetails);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/service-providers/test-org',
      { cache: 'no-store' }
    );
  });

  it('should return minimal organisation details when fetch returns minimal data', async () => {
    // Arrange
    mockFetchMinimalSuccess();
    
    // Act
    const result = await getOrganisationBySlug('minimal-org');
    
    // Assert
    expect(result).toEqual(mockMinimalOrganisationDetails);
  });

  it('should return null when organisation is not found', async () => {
    // Arrange
    mockFetchNotFound();
    
    // Act
    const result = await getOrganisationBySlug('non-existent-org');
    
    // Assert
    expect(result).toBeNull();
  });

  it('should return null when server error occurs', async () => {
    // Arrange
    mockFetchServerError();
    
    // Act
    const result = await getOrganisationBySlug('test-org');
    
    // Assert
    expect(result).toBeNull();
  });

  it('should return null when validation error occurs', async () => {
    // Arrange
    mockFetchValidationError();
    
    // Act
    const result = await getOrganisationBySlug('invalid-slug');
    
    // Assert
    expect(result).toBeNull();
  });

  it('should throw error when network error occurs', async () => {
    // Arrange
    mockFetchNetworkError();
    
    // Act & Assert
    await expect(getOrganisationBySlug('test-org')).rejects.toThrow('Network error');
  });

  it('should throw error when request times out', async () => {
    // Arrange
    mockFetchTimeout();
    
    // Act & Assert
    await expect(getOrganisationBySlug('test-org')).rejects.toThrow('Request timeout');
  });

  it('should handle empty slug gracefully', async () => {
    // Arrange
    mockFetchNotFound();
    
    // Act
    const result = await getOrganisationBySlug('');
    
    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/service-providers/',
      { cache: 'no-store' }
    );
  });

  it('should handle slug with special characters', async () => {
    // Arrange
    mockFetchSuccess();
    
    // Act
    const result = await getOrganisationBySlug('test-org-with-special-chars-123');
    
    // Assert
    expect(result).toEqual(mockOrganisationDetails);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/service-providers/test-org-with-special-chars-123',
      { cache: 'no-store' }
    );
  });

  it('should handle very long slug', async () => {
    // Arrange
    const longSlug = 'very-long-organisation-slug-that-might-be-used-in-some-edge-cases-and-should-be-handled-properly';
    mockFetchSuccess();
    
    // Act
    const result = await getOrganisationBySlug(longSlug);
    
    // Assert
    expect(result).toEqual(mockOrganisationDetails);
    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/service-providers/${longSlug}`,
      { cache: 'no-store' }
    );
  });

  it('should handle slug with hyphens and numbers', async () => {
    // Arrange
    mockFetchSuccess();
    
    // Act
    const result = await getOrganisationBySlug('test-org-123-456');
    
    // Assert
    expect(result).toEqual(mockOrganisationDetails);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/service-providers/test-org-123-456',
      { cache: 'no-store' }
    );
  });
});