'use client';

import React from 'react';
import { decodeHtmlEntities } from '@/utils/htmlDecode';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Simple HTML renderer for basic markup without heavy dependencies
function processSimpleMarkdown(text: string): string {
  // First, detect and mark sections that should be converted to bullet points
  const processedText = text
    // Handle bold markdown **text** and __text__ first (before single asterisk processing)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Handle implicit bullet points by detecting patterns after "following:" or "services:-"
  // Split into lines and process
  const lines = processedText.split('\n');
  const result = [];
  let inBulletSection = false;
  let currentBulletItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line ends with "following:" or "services:-" and should start a bullet section
    if (line.endsWith('following:') || line.endsWith('services:-')) {
      result.push(line);
      inBulletSection = true;
      currentBulletItems = [];
    }
    // Check if we're in a bullet section and this is a short line (likely a bullet point)
    else if (inBulletSection && line.length > 0 && line.length < 80 && !line.includes('.') && !line.endsWith(':')) {
      currentBulletItems.push(line);
    }
    // Check if we should end the bullet section (empty line, long line, or new section)
    else if (inBulletSection && (line.length === 0 || line.length > 80 || line.endsWith(':'))) {
      // Output the collected bullet items as a list
      if (currentBulletItems.length > 0) {
        const listItems = currentBulletItems.map(item => `<li>${item}</li>`).join('');
        result.push(`<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">${listItems}</ul>`);
        currentBulletItems = [];
      }
      inBulletSection = false;
      if (line.length > 0) {
        result.push(line);
      }
    }
    // Regular line - not in bullet section
    else {
      result.push(line);
    }
  }

  // Handle any remaining bullet items at the end
  if (currentBulletItems.length > 0) {
    const listItems = currentBulletItems.map(item => `<li>${item}</li>`).join('');
    result.push(`<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">${listItems}</ul>`);
  }

  const finalResult = result.join('\n')
    // Handle explicit bullet points with asterisk (* item) and dash (- item)
    // Support multiple spaces after the bullet marker and handle HTML entities
    .replace(/^[*\u2022\u2023\u25E6\u25AA\u25AB\u25CF\u25CB-]\s+(.+)$/gm, '<li>$1</li>')
    // Also handle cases where there might be extra whitespace
    .replace(/^\s*[*\u2022\u2023\u25E6\u25AA\u25AB\u25CF\u25CB-]\s+(.+)$/gm, '<li>$1</li>')
    // Handle HTML entity asterisks
    .replace(/^&ast;\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\s*&ast;\s+(.+)$/gm, '<li>$1</li>');

  // Only wrap loose li elements that are NOT already inside ul tags
  const finalLines = finalResult.split('\n');
  const wrappedResult = [];
  let looseLiItems = [];

  for (const line of finalLines) {
    if (line.trim().startsWith('<li>') && !line.includes('<ul')) {
      looseLiItems.push(line.trim());
    } else {
      if (looseLiItems.length > 0) {
        wrappedResult.push(`<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">${looseLiItems.join('')}</ul>`);
        looseLiItems = [];
      }
      wrappedResult.push(line);
    }
  }

  // Handle any remaining loose items
  if (looseLiItems.length > 0) {
    wrappedResult.push(`<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">${looseLiItems.join('')}</ul>`);
  }

  return wrappedResult.join('\n')
    // Handle line breaks
    .replace(/\n/g, '<br>')
    // Handle italic markdown *text* and _text* (after bullet points to avoid conflicts)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Clean up any malformed italic tags created from bullet points
    .replace(/<li><em>([^<]*)<\/em><\/li>/g, '<li>$1</li>')
    // Handle simple links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Clean up extra line breaks around lists
    .replace(/<\/ul><br>/g, '</ul>');
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const decodedContent = decodeHtmlEntities(content);
  const processedContent = processSimpleMarkdown(decodedContent);

  return (
    <div
      className={`prose prose-gray max-w-none leading-relaxed prose-sm prose-p:text-sm prose-p:leading-normal prose-p:text-gray-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
