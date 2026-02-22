import Link from 'next/link';

interface FormSuccessMessageProps {
  title: string;
  message: string;
  secondaryMessage?: string;
}

export default function FormSuccessMessage({
  title,
  message,
  secondaryMessage,
}: FormSuccessMessageProps) {
  return (
    <div className="content-container px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-brand-b/10 border border-brand-b rounded-lg p-8">
          <svg
            className="w-16 h-16 text-brand-b mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="heading-2 text-brand-b mb-4">{title}</h1>
          <p className="text-body mb-6">{message}</p>
          {secondaryMessage && <p className="text-body mb-6">{secondaryMessage}</p>}
          <Link href="/" className="btn-base btn-primary btn-md">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
