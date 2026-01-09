// Shared banner types for CMS-driven campaign banners

export type BannerTemplateType = 'giving-campaign' | 'partnership-charter' | 'resource-project';

export type BackgroundType = 'solid' | 'gradient' | 'image';

export type TextColour = 'black' | 'white';

export type LayoutStyle = 'split' | 'full-width' | 'card';

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

export interface VideoAsset {
  url: string;
  title: string;
  poster?: string;
  captions?: string;
}

export interface AccentGraphic {
  url: string;
  alt: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
}

export interface BannerBackground {
  type: BackgroundType;
  value: string; // Hex color, gradient string, or image URL
  overlay?: {
    colour: string;
    opacity: number;
  };
}

export interface BannerProps {
  // Core content
  title: string;
  description?: string;
  subtitle?: string;
  
  // Media
  logo?: MediaAsset;
  image?: MediaAsset;
  video?: VideoAsset;
  
  // Actions
  ctaButtons: CTAButton[];
  
  // Styling
  background: BannerBackground;
  textColour: TextColour;
  layoutStyle: LayoutStyle;
  accentGraphic?: AccentGraphic;
  
  // Optional features
  startDate?: string;
  endDate?: string;
  badgeText?: string;
  
  // CMS metadata
  id: string;
  templateType: BannerTemplateType;
  isActive?: boolean;
  locationSlug?: string;
  priority?: number;
  
  // Analytics
  trackingContext?: string;
  analyticsId?: string;
}

// Specific props for each banner type (extending base BannerProps)
export interface GivingCampaignProps extends BannerProps {
  templateType: 'giving-campaign';
  donationGoal?: {
    target: number;
    current: number;
    currency: string;
  };
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  campaignEndDate?: string;
}

export interface PartnershipCharterProps extends BannerProps {
  templateType: 'partnership-charter';
  partnerLogos?: MediaAsset[];
  charterType?: 'homeless-charter' | 'real-change' | 'alternative-giving' | 'partnership';
  signatoriesCount?: number;
}

export interface ResourceProjectProps extends BannerProps {
  templateType: 'resource-project';
  resourceType?: 'guide' | 'toolkit' | 'research' | 'training' | 'event';
  lastUpdated?: string;
  fileSize?: string;
  fileType?: string;
}

// Union type for all banner props
export type AnyBannerProps = GivingCampaignProps | PartnershipCharterProps | ResourceProjectProps;

// CMS configuration interface (for future use)
export interface BannerCMSConfig {
  locationSlug: string;
  banners: AnyBannerProps[];
  maxBannersPerLocation: number;
  allowedTemplateTypes: BannerTemplateType[];
  permissions: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canToggleVisibility: boolean;
  };
}