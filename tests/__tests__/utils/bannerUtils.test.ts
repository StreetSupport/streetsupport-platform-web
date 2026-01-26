import {
  generateBackgroundClasses,
  generateBackgroundStyles,
  generateTextColourClasses,
  generateLayoutClasses,
  generateCTAClasses
} from '@/utils/bannerUtils';
import { BannerBackground, CTAButton } from '@/types/banners';

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

    it('should return empty string for unknown layout', () => {
      const classes = generateLayoutClasses('unknown' as never);
      expect(classes).toBe('');
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
});
