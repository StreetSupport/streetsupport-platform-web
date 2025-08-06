import {
  generateBackgroundClasses,
  generateBackgroundStyles,
  generateTextColourClasses,
  generateLayoutClasses,
  generateCTAClasses,
  generateAccentGraphicClasses,
  validateBannerProps,
  formatCurrency,
  calculateProgress,
  generateUrgencyClasses
} from '@/utils/bannerUtils';
import { BannerBackground, TextColour, LayoutStyle, CTAButton } from '@/types/banners';

describe('Banner Utilities', () => {
  describe('generateBackgroundClasses', () => {
    it('should generate solid background classes', () => {
      const background: BannerBackground = {
        type: 'solid',
        value: '#FF0000'
      };
      const classes = generateBackgroundClasses(background);
      expect(classes).toBe('bg-gray-900');
    });

    it('should generate gradient background classes', () => {
      const background: BannerBackground = {
        type: 'gradient',
        value: 'linear-gradient(45deg, #FF0000, #0000FF)'
      };
      const classes = generateBackgroundClasses(background);
      expect(classes).toBe('bg-gradient-to-r');
    });

    it('should generate image background classes', () => {
      const background: BannerBackground = {
        type: 'image',
        value: 'https://example.com/image.jpg'
      };
      const classes = generateBackgroundClasses(background);
      expect(classes).toBe('bg-cover bg-center bg-no-repeat');
    });

    it('should add relative class when overlay is present', () => {
      const background: BannerBackground = {
        type: 'solid',
        value: '#FF0000',
        overlay: {
          colour: '#000000',
          opacity: 0.5
        }
      };
      const classes = generateBackgroundClasses(background);
      expect(classes).toContain('relative');
    });
  });

  describe('generateBackgroundStyles', () => {
    it('should generate solid background styles', () => {
      const background: BannerBackground = {
        type: 'solid',
        value: '#FF0000'
      };
      const styles = generateBackgroundStyles(background);
      expect(styles.backgroundColor).toBe('#FF0000');
    });

    it('should generate gradient background styles', () => {
      const gradient = 'linear-gradient(45deg, #FF0000, #0000FF)';
      const background: BannerBackground = {
        type: 'gradient',
        value: gradient
      };
      const styles = generateBackgroundStyles(background);
      expect(styles.background).toBe(gradient);
    });

    it('should generate image background styles', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const background: BannerBackground = {
        type: 'image',
        value: imageUrl
      };
      const styles = generateBackgroundStyles(background);
      expect(styles.backgroundImage).toBe(`url("${imageUrl}")`);
    });
  });

  describe('generateTextColourClasses', () => {
    it('should generate white text classes', () => {
      const classes = generateTextColourClasses('white');
      expect(classes).toBe('text-white');
    });

    it('should generate black text classes', () => {
      const classes = generateTextColourClasses('black');
      expect(classes).toBe('text-gray-900');
    });
  });

  describe('generateLayoutClasses', () => {
    it('should generate split layout classes', () => {
      const classes = generateLayoutClasses('split');
      expect(classes).toBe('grid md:grid-cols-2 gap-8 items-center');
    });

    it('should generate full-width layout classes', () => {
      const classes = generateLayoutClasses('full-width');
      expect(classes).toBe('text-center');
    });

    it('should generate card layout classes', () => {
      const classes = generateLayoutClasses('card');
      expect(classes).toBe('max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8');
    });
  });

  describe('generateCTAClasses', () => {
    const baseClasses = 'inline-flex items-center justify-center px-6 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    it('should generate primary button classes for white text', () => {
      const button: CTAButton = { label: 'Test', url: '/test', variant: 'primary' };
      const classes = generateCTAClasses(button, 'white');
      expect(classes).toContain(baseClasses);
      expect(classes).toContain('bg-white text-gray-900');
    });

    it('should generate primary button classes for black text', () => {
      const button: CTAButton = { label: 'Test', url: '/test', variant: 'primary' };
      const classes = generateCTAClasses(button, 'black');
      expect(classes).toContain(baseClasses);
      expect(classes).toContain('bg-brand-a text-white');
    });

    it('should generate secondary button classes', () => {
      const button: CTAButton = { label: 'Test', url: '/test', variant: 'secondary' };
      const classes = generateCTAClasses(button, 'white');
      expect(classes).toContain('bg-white/20');
    });

    it('should generate outline button classes', () => {
      const button: CTAButton = { label: 'Test', url: '/test', variant: 'outline' };
      const classes = generateCTAClasses(button, 'white');
      expect(classes).toContain('border-2 border-white');
    });

    it('should default to primary variant', () => {
      const button: CTAButton = { label: 'Test', url: '/test' };
      const classes = generateCTAClasses(button, 'white');
      expect(classes).toContain('bg-white text-gray-900');
    });
  });

  describe('generateAccentGraphicClasses', () => {
    it('should generate top-left positioning', () => {
      const classes = generateAccentGraphicClasses('top-left');
      expect(classes).toBe('absolute top-4 left-4 z-10');
    });

    it('should generate center positioning', () => {
      const classes = generateAccentGraphicClasses('center');
      expect(classes).toBe('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0');
    });

    it('should default to top-right positioning', () => {
      const classes = generateAccentGraphicClasses();
      expect(classes).toBe('absolute top-4 right-4 z-10');
    });
  });

  describe('validateBannerProps', () => {
    const validProps = {
      title: 'Test Banner',
      ctaButtons: [{ label: 'Test', url: '/test' }],
      background: { type: 'solid', value: '#FF0000' },
      textColour: 'white',
      layoutStyle: 'full-width'
    };

    it('should validate correct props', () => {
      const result = validateBannerProps(validProps);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing title', () => {
      const props = { ...validProps, title: '' };
      const result = validateBannerProps(props);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should reject missing CTA buttons', () => {
      const props = { ...validProps, ctaButtons: [] };
      const result = validateBannerProps(props);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one CTA button is required');
    });

    it('should validate CTA button properties', () => {
      const props = {
        ...validProps,
        ctaButtons: [{ label: '', url: '' }]
      };
      const result = validateBannerProps(props);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CTA button 1 label is required');
      expect(result.errors).toContain('CTA button 1 URL is required');
    });

    it('should reject missing background properties', () => {
      const props = { ...validProps, background: null };
      const result = validateBannerProps(props);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Background type is required');
    });
  });

  describe('formatCurrency', () => {
    it('should format GBP currency', () => {
      const formatted = formatCurrency(1000, 'GBP');
      expect(formatted).toBe('£1,000');
    });

    it('should format without decimals', () => {
      const formatted = formatCurrency(1000.50, 'GBP');
      expect(formatted).toBe('£1,001');
    });

    it('should handle large numbers', () => {
      const formatted = formatCurrency(1000000, 'GBP');
      expect(formatted).toBe('£1,000,000');
    });

    it('should default to GBP', () => {
      const formatted = formatCurrency(100);
      expect(formatted).toBe('£100');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate percentage correctly', () => {
      const progress = calculateProgress(250, 1000);
      expect(progress).toBe(25);
    });

    it('should cap at 100%', () => {
      const progress = calculateProgress(1500, 1000);
      expect(progress).toBe(100);
    });

    it('should handle zero values', () => {
      const progress = calculateProgress(0, 1000);
      expect(progress).toBe(0);
    });

    it('should round to nearest integer', () => {
      const progress = calculateProgress(333, 1000);
      expect(progress).toBe(33);
    });
  });

  describe('generateUrgencyClasses', () => {
    it('should generate critical urgency classes', () => {
      const classes = generateUrgencyClasses('critical');
      expect(classes).toBe('bg-red-600 text-white animate-pulse');
    });

    it('should generate high urgency classes', () => {
      const classes = generateUrgencyClasses('high');
      expect(classes).toBe('bg-red-500 text-white');
    });

    it('should generate medium urgency classes', () => {
      const classes = generateUrgencyClasses('medium');
      expect(classes).toBe('bg-yellow-500 text-gray-900');
    });

    it('should generate low urgency classes', () => {
      const classes = generateUrgencyClasses('low');
      expect(classes).toBe('bg-green-500 text-white');
    });

    it('should default to blue for unknown urgency', () => {
      const classes = generateUrgencyClasses('unknown');
      expect(classes).toBe('bg-blue-500 text-white');
    });
  });
});