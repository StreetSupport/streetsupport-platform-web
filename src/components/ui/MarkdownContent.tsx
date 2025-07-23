'use client';

import React from 'react';
import { decodeHtmlEntities } from '@/utils/htmlDecode';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Simple HTML renderer for basic markup without heavy dependencies
function processSimpleMarkdown(text: string): string {
  return text
    // Handle line breaks
    .replace(/\n/g, '<br>')
    // Handle bold markdown **text** and __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Handle italic markdown *text* and _text_
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Handle simple links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Handle simple lists - basic implementation
    .replace(/^- (.+)$/gm, '<li class="list-disc ml-4">$1</li>');
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const decodedContent = decodeHtmlEntities(content);
  const processedContent = processSimpleMarkdown(decodedContent);
  
  return (
    <div 
      className={`prose prose-gray max-w-none leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}