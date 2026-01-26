// Simplified banner types for CMS-driven campaign banners
// Refactored from three template types to a single flexible banner type

export type MediaType = 'image' | 'youtube';

export type BackgroundType = 'solid' | 'gradient' | 'image';

export type TextColour = 'black' | 'white';

export type LayoutStyle = 'split' | 'full-width';

export interface CTAButton {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
  trackingContext?: string;
}

export interface MediaAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface UploadedFile {
  url: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
}

export interface BannerBackground {
  type: BackgroundType;
  value: string;
  overlay?: {
    colour: string;
    opacity: number;
  };
}

export interface BannerBorder {
  showBorder: boolean;
  colour: string;
}

export interface BannerProps {
  // Core content
  title: string;
  description?: string;
  subtitle?: string;

  // Media - either image or YouTube
  mediaType: MediaType;
  image?: MediaAsset;
  youtubeUrl?: string;
  logo?: MediaAsset;

  // Actions
  ctaButtons: CTAButton[];

  // Styling
  background: BannerBackground;
  border?: BannerBorder;
  textColour: TextColour;
  layoutStyle: LayoutStyle;

  // Scheduling
  startDate?: string;
  endDate?: string;

  // CMS metadata
  id: string;
  isActive?: boolean;
  locationSlug?: string;
  priority?: number;

  // Optional file attachment
  uploadedFile?: UploadedFile;

  // Analytics
  trackingContext?: string;
  analyticsId?: string;

  // For styling
  className?: string;
}
