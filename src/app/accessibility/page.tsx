// import Link from 'next/link'; // Unused import
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function AccessibilityPage() {
  return (
    <main>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "Accessibility", current: true }
        ]} 
      />

      <div className="max-w-4xl mx-auto px-6 py-12">

        <h1>Accessibility Statement</h1>
        <p>Accessibility statement content goes here.</p>
      </div>
    </main>
  );
}
