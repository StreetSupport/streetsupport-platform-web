'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { decodeHtmlEntities } from '@/utils/htmlDecode';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Only decode HTML entities, preserve markdown syntax for react-markdown to process
  const decodedContent = decodeHtmlEntities(content);
  
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customize link styling
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target={href?.startsWith('http') ? '_blank' : '_self'}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // Customize paragraph styling
          p: ({ children, ...props }) => (
            <p className="mb-3 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          // Customize list styling
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          // Customize heading styling
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mb-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium mb-2" {...props}>
              {children}
            </h3>
          ),
          // Customize emphasis styling
          em: ({ children, ...props }) => (
            <em className="italic text-gray-600" {...props}>
              {children}
            </em>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold" {...props}>
              {children}
            </strong>
          ),
          // Handle HTML <b> tags
          b: ({ children, ...props }) => (
            <strong className="font-semibold" {...props}>
              {children}
            </strong>
          ),
          // Handle HTML <i> tags
          i: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          // Customize blockquote styling
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-3" {...props}>
              {children}
            </blockquote>
          ),
          // Customize code styling
          code: ({ children, ...props }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          ),
        }}
      >
        {decodedContent}
      </ReactMarkdown>
    </div>
  );
}