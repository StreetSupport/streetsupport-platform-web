import { BannerBackground, TextColour, LayoutStyle, CTAButton } from '@/types/banners';

export function generateBackgroundClasses(background: BannerBackground): string {
  const { type, overlay } = background;

  let classes = '';

  switch (type) {
    case 'solid':
      classes = 'bg-gray-900';
      break;

    case 'gradient':
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

export function generateTextColourClasses(textColour: TextColour): string {
  return textColour === 'white' ? 'text-white' : 'text-gray-900';
}

export function generateLayoutClasses(layoutStyle: LayoutStyle): string {
  switch (layoutStyle) {
    case 'split':
      return 'grid md:grid-cols-2 gap-8 items-center';
    case 'full-width':
      return 'text-center';
    default:
      return '';
  }
}

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
        baseClasses += ' bg-white !text-brand-a border border-brand-a hover:bg-brand-a hover:!text-white hover:border-brand-a focus:ring-brand-a';
      }
      break;

    case 'outline':
      if (textColour === 'white') {
        baseClasses += ' bg-white/10 border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white';
      } else {
        baseClasses += ' bg-transparent border-2 border-brand-a !text-brand-a hover:bg-brand-a hover:!text-white focus:ring-brand-a';
      }
      break;
  }

  return baseClasses;
}
