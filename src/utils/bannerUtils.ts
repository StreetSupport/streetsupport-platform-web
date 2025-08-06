import { BannerBackground, TextColour, LayoutStyle, CTAButton } from '@/types/banners';

/**
 * Generate Tailwind CSS classes for banner background
 */
export function generateBackgroundClasses(background: BannerBackground): string {
  const { type, value, overlay } = background;
  
  let classes = '';
  
  switch (type) {
    case 'solid':
      // Use Tailwind color classes if possible, otherwise custom style
      if (value.startsWith('#')) {
        classes = 'bg-gray-900'; // Fallback, will be overridden with inline style
      } else {
        classes = `bg-${value}`;
      }
      break;
      
    case 'gradient':
      // Custom gradient will be applied via inline style
      classes = 'bg-gradient-to-r';
      break;
      
    case 'image':
      classes = 'bg-cover bg-center bg-no-repeat';
      break;
  }
  
  if (overlay) {
    classes += ' relative';
  }
  
  return classes;
}

/**
 * Generate inline styles for banner background
 */
export function generateBackgroundStyles(background: BannerBackground): React.CSSProperties {
  const { type, value } = background;
  const styles: React.CSSProperties = {};
  
  switch (type) {
    case 'solid':
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
        styles.backgroundColor = value;
      }
      break;
      
    case 'gradient':
      styles.background = value;
      break;
      
    case 'image':
      styles.backgroundImage = `url("${value}")`;
      break;
  }
  
  return styles;
}

/**
 * Generate text colour classes
 */
export function generateTextColourClasses(textColour: TextColour): string {
  return textColour === 'white' ? 'text-white' : 'text-gray-900';
}

/**
 * Generate layout classes
 */
export function generateLayoutClasses(layoutStyle: LayoutStyle): string {
  switch (layoutStyle) {
    case 'split':
      return 'grid md:grid-cols-2 gap-8 items-center';
    case 'full-width':
      return 'text-center';
    case 'card':
      return 'max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8';
    default:
      return '';
  }
}

/**
 * Generate CTA button classes based on variant and text colour
 */
export function generateCTAClasses(button: CTAButton, textColour: TextColour): string {
  const { variant = 'primary' } = button;
  let baseClasses = 'inline-flex items-center justify-center px-6 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  switch (variant) {
    case 'primary':
      if (textColour === 'white') {
        baseClasses += ' bg-white text-gray-900 hover:bg-gray-100 focus:ring-white';
      } else {
        baseClasses += ' bg-brand-a text-white hover:bg-brand-b focus:ring-brand-a';
      }
      break;
      
    case 'secondary':
      if (textColour === 'white') {
        baseClasses += ' bg-white/20 text-white border border-white/40 hover:bg-white/30 focus:ring-white';
      } else {
        baseClasses += ' bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500';
      }
      break;
      
    case 'outline':
      if (textColour === 'white') {
        baseClasses += ' border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white';
      } else {
        baseClasses += ' border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-900';
      }
      break;
  }
  
  return baseClasses;
}

/**
 * Generate accent graphic positioning classes
 */
export function generateAccentGraphicClasses(position?: string): string {
  switch (position) {
    case 'top-left':
      return 'absolute top-4 left-4 z-10';
    case 'top-right':
      return 'absolute top-4 right-4 z-10';
    case 'bottom-left':
      return 'absolute bottom-4 left-4 z-10';
    case 'bottom-right':
      return 'absolute bottom-4 right-4 z-10';
    case 'center':
      return 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0';
    default:
      return 'absolute top-4 right-4 z-10';
  }
}

/**
 * Validate banner props for required fields
 */
export function validateBannerProps(props: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!props.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!props.ctaButtons || props.ctaButtons.length === 0) {
    errors.push('At least one CTA button is required');
  }
  
  if (props.ctaButtons) {
    props.ctaButtons.forEach((button: CTAButton, index: number) => {
      if (!button.label?.trim()) {
        errors.push(`CTA button ${index + 1} label is required`);
      }
      if (!button.url?.trim()) {
        errors.push(`CTA button ${index + 1} URL is required`);
      }
    });
  }
  
  if (!props.background?.type) {
    errors.push('Background type is required');
  }
  
  if (!props.background?.value?.trim()) {
    errors.push('Background value is required');
  }
  
  if (!props.textColour) {
    errors.push('Text colour is required');
  }
  
  if (!props.layoutStyle) {
    errors.push('Layout style is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format currency for donation displays
 */
export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculate donation progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * Generate urgency indicator classes
 */
export function generateUrgencyClasses(urgencyLevel: string): string {
  switch (urgencyLevel) {
    case 'critical':
      return 'bg-red-600 text-white animate-pulse';
    case 'high':
      return 'bg-red-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-gray-900';
    case 'low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-blue-500 text-white';
  }
}