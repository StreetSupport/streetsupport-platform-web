'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // In a real implementation, you'd integrate with your newsletter service
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Thank you for subscribing! You&apos;ll receive our monthly newsletter with updates on platform developments and impact stories.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-brand-i p-8 rounded-lg">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-3 text-brand-l">Stay Updated</h3>
        <p className="text-brand-l mb-6">
          Get monthly updates on platform developments, impact stories, and sector news delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg text-brand-l border border-gray-300 focus:ring-2 focus:ring-brand-a focus:border-transparent transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-6 py-3 bg-transparent border-2 border-brand-a text-brand-a font-semibold rounded-lg hover:bg-brand-a hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-a" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
          
          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              status === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </form>
        
        <p className="text-xs text-brand-l mt-4">
          We respect your privacy. Unsubscribe at any time. 
          <br />
          Read our{' '}
          <a 
            href="https://streetsupport.net/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand-a underline hover:no-underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}