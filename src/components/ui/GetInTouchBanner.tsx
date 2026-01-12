import Link from 'next/link';

interface GetInTouchBannerProps {
  email: string;
}

export default function GetInTouchBanner({ email }: GetInTouchBannerProps) {
  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
        <p className="mb-4">
          If you&apos;d like to get involved or have suggestions, please contact us at{' '}
          <a href={`mailto:${email}`} className="text-brand-a hover:text-brand-b underline">{email}</a>.
        </p>
        <p>
          If you are interested in partnering with Street Support Network, you can find out more by filling in our{' '}
          <Link href="/partnership-application-form" className="text-brand-a hover:text-brand-b underline">partnership application form</Link>.
        </p>
      </div>
    </section>
  );
}
