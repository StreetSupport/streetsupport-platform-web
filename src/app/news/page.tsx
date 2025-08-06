import Breadcrumbs from '@/components/ui/Breadcrumbs';
import NewsHeader from '@/components/News/NewsHeader';
import NewsGrid from '@/components/News/NewsGrid';
import Newsletter from '@/components/News/Newsletter';
import Link from 'next/link';

export default function NewsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "News", current: true }
        ]} 
      />

      <NewsHeader 
        title="News & Updates"
        description="Stay updated with the latest news, developments, and stories from Street Support and the homelessness sector."
        showCategories={true}
      />

      <NewsGrid 
        title="Latest Articles"
        showSearch={true}
        maxItems={6}
      />

      <div className="bg-brand-q py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Newsletter />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <section className="text-center">
          <h2 className="text-2xl font-bold text-brand-l mb-6">Get In Touch</h2>
          <p className="text-brand-f mb-8 max-w-2xl mx-auto">
            For media enquiries, partnership opportunities, or to learn more about our impact, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b hover:text-white transition-colors duration-300"
            >
              Contact Our Media Team
            </Link>
            <Link
              href="/about/impact"
              className="btn-base btn-secondary btn-md"
            >
              View Our Impact
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}