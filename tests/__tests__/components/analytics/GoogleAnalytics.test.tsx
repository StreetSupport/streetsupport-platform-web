import { render } from '@testing-library/react';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockedScript({ children, dangerouslySetInnerHTML, ...props }: any) {
    if (dangerouslySetInnerHTML) {
      return <script {...props} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
    }
    return <script {...props}>{children}</script>;
  };
});

describe('GoogleAnalytics Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should render analytics scripts when measurement ID is provided and conditions are met', () => {
    process.env.NODE_ENV = 'production';
    const measurementId = 'G-YW6NQ7QLBR';

    const { container } = render(<GoogleAnalytics measurementId={measurementId} />);
    
    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(2);
    
    // Check for gtag script source
    const gtagScript = Array.from(scripts).find(script => 
      script.getAttribute('src')?.includes('googletagmanager.com/gtag/js')
    );
    expect(gtagScript).toBeTruthy();
    expect(gtagScript?.getAttribute('src')).toBe(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
    
    // Check for analytics configuration script
    const configScript = Array.from(scripts).find(script => 
      script.innerHTML.includes('dataLayer')
    );
    expect(configScript).toBeTruthy();
    expect(configScript?.innerHTML).toContain(`gtag('config', '${measurementId}'`);
  });

  it('should not render when no measurement ID is provided', () => {
    process.env.NODE_ENV = 'production';

    const { container } = render(<GoogleAnalytics />);
    
    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(0);
  });

  it('should not render in development mode unless explicitly enabled', () => {
    process.env.NODE_ENV = 'development';
    const measurementId = 'G-YW6NQ7QLBR';

    const { container } = render(<GoogleAnalytics measurementId={measurementId} />);
    
    // Should not render in development mode by default
    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(0);
  });

  it('should render when NEXT_PUBLIC_ENABLE_ANALYTICS is true', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';
    const measurementId = 'G-YW6NQ7QLBR';

    const { container } = render(<GoogleAnalytics measurementId={measurementId} />);
    
    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(2);
  });

  it('should include proper gtag configuration', () => {
    process.env.NODE_ENV = 'production';
    const measurementId = 'G-YW6NQ7QLBR';

    const { container } = render(<GoogleAnalytics measurementId={measurementId} />);
    
    const configScript = Array.from(container.querySelectorAll('script')).find(script => 
      script.innerHTML.includes('dataLayer')
    );
    
    expect(configScript?.innerHTML).toContain('window.dataLayer = window.dataLayer || []');
    expect(configScript?.innerHTML).toContain('function gtag(){dataLayer.push(arguments);}');
    expect(configScript?.innerHTML).toContain("gtag('js', new Date())");
    expect(configScript?.innerHTML).toContain(`gtag('config', '${measurementId}'`);
    expect(configScript?.innerHTML).toContain('page_title: document.title');
    expect(configScript?.innerHTML).toContain('page_location: window.location.href');
  });
});