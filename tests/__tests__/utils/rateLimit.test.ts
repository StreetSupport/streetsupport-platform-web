import { checkRateLimit } from '../../../src/utils/rateLimit';
import { NextRequest } from 'next/server';

function makeRequest(ip: string = '127.0.0.1'): NextRequest {
  const req = new NextRequest('http://localhost/api/geocode?postcode=M1+1AA', {
    headers: { 'x-forwarded-for': ip },
  });
  return req;
}

describe('checkRateLimit', () => {
  const options = { maxRequests: 3, windowMs: 60_000 };

  it('should allow requests within the limit', () => {
    const ip = '10.0.0.1';
    const result1 = checkRateLimit(makeRequest(ip), options);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = checkRateLimit(makeRequest(ip), options);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = checkRateLimit(makeRequest(ip), options);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('should block requests exceeding the limit', () => {
    const ip = '10.0.0.2';
    for (let i = 0; i < 3; i++) {
      checkRateLimit(makeRequest(ip), options);
    }

    const blocked = checkRateLimit(makeRequest(ip), options);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('should track different IPs independently', () => {
    const ipA = '10.0.0.3';
    const ipB = '10.0.0.4';

    for (let i = 0; i < 3; i++) {
      checkRateLimit(makeRequest(ipA), options);
    }

    const blockedA = checkRateLimit(makeRequest(ipA), options);
    expect(blockedA.allowed).toBe(false);

    const allowedB = checkRateLimit(makeRequest(ipB), options);
    expect(allowedB.allowed).toBe(true);
    expect(allowedB.remaining).toBe(2);
  });

  it('should reset after the window expires', () => {
    const ip = '10.0.0.5';
    const shortWindow = { maxRequests: 1, windowMs: 50 };

    const result1 = checkRateLimit(makeRequest(ip), shortWindow);
    expect(result1.allowed).toBe(true);

    const blocked = checkRateLimit(makeRequest(ip), shortWindow);
    expect(blocked.allowed).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result2 = checkRateLimit(makeRequest(ip), shortWindow);
        expect(result2.allowed).toBe(true);
        resolve();
      }, 60);
    });
  });

  it('should include a resetTime in the result', () => {
    const ip = '10.0.0.6';
    const before = Date.now();
    const result = checkRateLimit(makeRequest(ip), options);
    const after = Date.now();

    expect(result.resetTime).toBeGreaterThanOrEqual(before + options.windowMs);
    expect(result.resetTime).toBeLessThanOrEqual(after + options.windowMs);
  });

  it('should handle missing x-forwarded-for header', () => {
    const req = new NextRequest('http://localhost/api/geocode?postcode=M1+1AA');
    const result = checkRateLimit(req, { maxRequests: 100, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
  });
});
