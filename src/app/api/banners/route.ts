import { NextRequest, NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { AnyBannerProps, GivingCampaignProps, PartnershipCharterProps, ResourceProjectProps } from '@/types/banners';

// Disable caching for this API route to ensure fresh banner data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const locationSlug = searchParams.get('location');

    // Fetch banner data from MongoDB
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const bannersCol = db.collection('Banners');

    // Build query - only active banners
    const query: Record<string, unknown> = {
      IsActive: true
    };

    // Filter by location if provided
    if (locationSlug) {
      query.LocationSlug = locationSlug;
    }

    // Fetch banners sorted by Priority (descending) and limited to 6
    const rawBanners = await bannersCol
      .find(query)
      .sort({ Priority: 1 })
      .limit(6)
      .toArray();

    // Transform MongoDB documents (PascalCase) to web format (camelCase)
    const banners: AnyBannerProps[] = rawBanners.map(banner => {
      // Base banner properties
      const baseBanner = {
        id: banner._id.toString(),
        title: banner.Title,
        description: banner.Description,
        subtitle: banner.Subtitle,
        templateType: banner.TemplateType,
        
        // Media
        logo: banner.Logo ? {
          url: banner.Logo.Url || '',
          alt: banner.Logo.Alt || '',
          width: banner.Logo.Width,
          height: banner.Logo.Height
        } : undefined,
        
        image: banner.MainImage ? {
          url: banner.MainImage.Url || '',
          alt: banner.MainImage.Alt || '',
          width: banner.MainImage.Width,
          height: banner.MainImage.Height
        } : undefined,
        
        // Actions
        ctaButtons: banner.CtaButtons?.map((cta: Record<string, unknown>) => ({
          label: cta.Label as string,
          url: cta.Url as string,
          variant: cta.Variant as 'primary' | 'secondary' | 'outline' | undefined,
          external: cta.External as boolean | undefined
        })) || [],
        
        // Styling
        background: {
          type: banner.Background?.Type || 'solid',
          value: banner.Background?.Value || '#ffffff',
          overlay: banner.Background?.Overlay ? {
            colour: banner.Background.Overlay.Colour,
            opacity: banner.Background.Overlay.Opacity
          } : undefined
        },
        textColour: banner.TextColour || 'black',
        layoutStyle: banner.LayoutStyle || 'full-width',
        
        // Scheduling
        startDate: banner.StartDate ? new Date(banner.StartDate).toISOString() : undefined,
        endDate: banner.EndDate ? new Date(banner.EndDate).toISOString() : undefined,
        badgeText: banner.BadgeText,
        
        // CMS metadata
        isActive: banner.IsActive,
        locationSlug: banner.LocationSlug,
        priority: banner.Priority
      };

      // Template-specific properties
      if (banner.TemplateType === 'giving-campaign') {
        const givingBanner: GivingCampaignProps = {
          ...baseBanner,
          templateType: 'giving-campaign',
          donationGoal: banner.GivingCampaign?.DonationGoal ? {
            target: banner.GivingCampaign.DonationGoal.Target || 0,
            current: banner.GivingCampaign.DonationGoal.Current || 0,
            currency: banner.GivingCampaign.DonationGoal.Currency || 'GBP'
          } : undefined,
          urgencyLevel: banner.GivingCampaign?.UrgencyLevel,
          campaignEndDate: banner.GivingCampaign?.CampaignEndDate 
            ? new Date(banner.GivingCampaign.CampaignEndDate).toISOString() 
            : undefined
        };
        return givingBanner;
      }

      if (banner.TemplateType === 'partnership-charter') {
        const charterBanner: PartnershipCharterProps = {
          ...baseBanner,
          templateType: 'partnership-charter',
          partnerLogos: banner.PartnershipCharter?.PartnerLogos?.map((logo: Record<string, unknown>) => ({
            url: logo.Url as string || '',
            alt: logo.Alt as string || '',
            width: logo.Width as number | undefined,
            height: logo.Height as number | undefined
          })),
          charterType: banner.PartnershipCharter?.CharterType,
          signatoriesCount: banner.PartnershipCharter?.SignatoriesCount
        };
        return charterBanner;
      }

      if (banner.TemplateType === 'resource-project') {
        const resourceBanner: ResourceProjectProps = {
          ...baseBanner,
          templateType: 'resource-project',
          resourceType: banner.ResourceProject?.ResourceFile?.ResourceType,
          downloadCount: banner.ResourceProject?.ResourceFile?.DownloadCount,
          lastUpdated: banner.ResourceProject?.ResourceFile?.LastUpdated 
            ? new Date(banner.ResourceProject.ResourceFile.LastUpdated).toISOString() 
            : undefined,
          fileSize: banner.ResourceProject?.ResourceFile?.FileSize,
          fileType: banner.ResourceProject?.ResourceFile?.FileType
        };
        return resourceBanner;
      }

      // Fallback to base banner
      return baseBanner as AnyBannerProps;
    });

    // Return response without caching headers to ensure fresh data
    return NextResponse.json({
      status: 'success',
      banners
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[API ERROR] /api/banners:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Unable to fetch banners at this time',
      banners: []
    }, { status: 500 });
  }
}
