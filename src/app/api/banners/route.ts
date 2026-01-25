import { NextRequest, NextResponse } from 'next/server';
import { getClientPromise } from '@/utils/mongodb';
import { BannerProps } from '@/types/banners';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const locationSlug = searchParams.get('location');

    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const bannersCol = db.collection('Banners');

    const query: Record<string, unknown> = {
      IsActive: true,
      MediaType: { $exists: true }
    };

    if (locationSlug) {
      query.LocationSlug = locationSlug;
    }

    const rawBanners = await bannersCol
      .find(query)
      .sort({ Priority: 1 })
      .limit(6)
      .toArray();

    const banners: BannerProps[] = rawBanners.map(banner => ({
      id: banner._id.toString(),
      title: banner.Title,
      description: banner.Description,
      subtitle: banner.Subtitle,

      mediaType: banner.MediaType || 'image',
      youtubeUrl: banner.YouTubeUrl,

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

      ctaButtons: banner.CtaButtons?.map((cta: Record<string, unknown>) => ({
        label: cta.Label as string,
        url: cta.Url as string,
        variant: cta.Variant as 'primary' | 'secondary' | 'outline' | undefined,
        external: cta.External as boolean | undefined
      })) || [],

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

      uploadedFile: banner.UploadedFile ? {
        url: banner.UploadedFile.FileUrl,
        fileName: banner.UploadedFile.FileName,
        fileSize: banner.UploadedFile.FileSize,
        fileType: banner.UploadedFile.FileType
      } : undefined,

      isActive: banner.IsActive,
      locationSlug: banner.LocationSlug,
      priority: banner.Priority
    }));

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
