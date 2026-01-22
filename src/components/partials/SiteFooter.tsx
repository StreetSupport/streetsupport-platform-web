'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { openPreferences } = useCookieConsent();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use JSONP approach for Mailchimp subscription
      const callbackName = `mailchimpCallback_${Date.now()}`;
      const params = new URLSearchParams({
        u: 'da9a1d4bb2b1a69a981456972',
        id: 'c966413ba3',
        EMAIL: email,
        c: callbackName
      });
      
      // Create a promise that resolves when the JSONP callback is called
      const jsonpPromise = new Promise<{ result: string; msg: string }>((resolve, reject) => {
        // Set up the callback function
        (window as unknown as Record<string, unknown>)[callbackName] = (data: { result: string; msg: string }) => {
          resolve(data);
          // Clean up
          delete (window as unknown as Record<string, unknown>)[callbackName];
          document.head.removeChild(script);
        };
        
        // Create and append the script tag
        const script = document.createElement('script');
        script.src = `https://streetsupport.us12.list-manage.com/subscribe/post-json?${params.toString()}`;
        script.onerror = () => {
          reject(new Error('Network error'));
          delete (window as unknown as Record<string, unknown>)[callbackName];
          document.head.removeChild(script);
        };
        document.head.appendChild(script);
        
        // Set a timeout to prevent hanging
        setTimeout(() => {
          if ((window as unknown as Record<string, unknown>)[callbackName]) {
            reject(new Error('Timeout'));
            delete (window as unknown as Record<string, unknown>)[callbackName];
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
          }
        }, 10000);
      });
      
      const result = await jsonpPromise;
      
      if (result.result === 'success') {
        setStatus('success');
        setEmail('');
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        // Handle Mailchimp error messages
        console.error('Mailchimp error:', result.msg);
        setStatus('error');
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-brand-k text-white">
      {/* Main Footer Content */}
      <div className="py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

            {/* Quick Links */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/find-help" className="text-brand-f hover:text-brand-a text-sm transition-colors duration-200">
                      Find Help
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-brand-f hover:text-brand-a text-sm transition-colors duration-200">
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-brand-f hover:text-brand-a text-sm transition-colors duration-200">
                      News
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-brand-f hover:text-brand-a text-sm transition-colors duration-200">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
              <p className="text-brand-f text-sm mb-6 leading-relaxed">
                Get updates about our work and new resources to support people experiencing homelessness.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-4" suppressHydrationWarning>
                <div suppressHydrationWarning>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                    aria-describedby={status !== 'idle' ? 'newsletter-footer-status' : undefined}
                    className="w-full px-4 py-3 border border-brand-f rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent text-brand-q placeholder-brand-f text-sm"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full btn-base btn-primary btn-md disabled:bg-brand-f disabled:text-brand-l disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              
              {status === 'success' && (
                <p id="newsletter-footer-status" role="status" aria-live="polite" className="mt-4 text-brand-b text-sm">
                  Thanks for subscribing! Please check your email to confirm.
                </p>
              )}

              {status === 'error' && (
                <p id="newsletter-footer-status" role="alert" aria-live="assertive" className="mt-4 text-brand-g text-sm">
                  Something went wrong. Please try again later.
                </p>
              )}
              
              <p className="mt-4 text-brand-f text-xs leading-relaxed">
                We respect your privacy and won&apos;t share your email address.
              </p>
            </div>

            {/* Connect */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
                <p className="text-brand-f text-sm mb-6 leading-relaxed">
                  Follow us on social media for updates and stories from our work.
                </p>
                
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/streetsupport/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-brand-f hover:bg-brand-a rounded-full transition-colors duration-200"
                    aria-label="Follow us on Facebook"
                  >
                    <Image
                      src="/assets/icons/facebook-brand-colour.svg"
                      alt="Facebook"
                      width={22}
                      height={22}
                      className="filter brightness-0 invert"
                    />
                  </a>
                  
                  <a
                    href="https://bsky.app/profile/streetsupport.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-brand-f hover:bg-brand-a rounded-full transition-colors duration-200"
                    aria-label="Follow us on Bluesky"
                  >
                    <Image
                      src="/assets/icons/bluesky.svg"
                      alt="Bluesky"
                      width={22}
                      height={22}
                      className="filter brightness-0 invert"
                    />
                  </a>
                </div>
              </div>
              
              <div className="pt-2 border-t border-brand-l">
                <p className="text-brand-f text-sm mb-2">For urgent help:</p>
                <a 
                  href="tel:999" 
                  className="!text-brand-g hover:opacity-80 text-base font-semibold transition-opacity duration-200"
                  style={{ color: '#a90000 !important' }}
                >
                  Emergency: 999
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-l py-8">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-brand-f">
            <div className="text-center md:text-left">
              <p className="text-sm">
                © {new Date().getFullYear()} Street Support Network Ltd.
              </p>
              <p className="text-xs mt-1">
                Registered Charity 1177546
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs">
              <Link href="/about/privacy-and-data/privacy-policy" className="hover:text-brand-a transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/about/privacy-and-data/terms-and-conditions" className="hover:text-brand-a transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link href="/about/privacy-and-data/cookie-policy" className="hover:text-brand-a transition-colors duration-200">
                Cookie Policy
              </Link>
              <button
                type="button"
                onClick={openPreferences}
                className="hover:text-brand-a transition-colors duration-200"
              >
                Cookie Settings
              </button>
              <Link href="/about/accessibility" className="hover:text-brand-a transition-colors duration-200">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}