import React from 'react';
import { render } from '@testing-library/react';
import MarkdownContent from '@/components/ui/MarkdownContent';

describe('MarkdownContent', () => {
  it('should render bullet points with asterisks correctly', () => {
    const content = `
* First bullet point
* Second bullet point
* Third bullet point
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">');
    expect(container.innerHTML).toContain('<li>First bullet point</li>');
    expect(container.innerHTML).toContain('<li>Second bullet point</li>');
    expect(container.innerHTML).toContain('<li>Third bullet point</li>');
  });

  it('should render bullet points with dashes correctly', () => {
    const content = `
- First bullet point
- Second bullet point
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">');
    expect(container.innerHTML).toContain('<li>First bullet point</li>');
    expect(container.innerHTML).toContain('<li>Second bullet point</li>');
  });

  it('should handle mixed content with bullet points', () => {
    const content = `
This is a paragraph.

* First bullet point
* Second bullet point

Another paragraph.
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('This is a paragraph.');
    expect(container.innerHTML).toContain('<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">');
    expect(container.innerHTML).toContain('<li>First bullet point</li>');
    expect(container.innerHTML).toContain('Another paragraph.');
  });

  it('should handle implicit bullet points after "following:" pattern', () => {
    const content = `
We can provide support for the following:
Confidential emotional support
Advocacy & support to attend appointments
Safety planning

Additional text here.
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('We can provide support for the following:');
    expect(container.innerHTML).toContain('<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">');
    expect(container.innerHTML).toContain('<li>Confidential emotional support</li>');
    expect(container.innerHTML).toContain('<li>Advocacy &amp; support to attend appointments</li>');
    expect(container.innerHTML).toContain('<li>Safety planning</li>');
    expect(container.innerHTML).toContain('Additional text here.');
  });

  it('should handle implicit bullet points after "services:-" pattern', () => {
    const content = `
Support to access other services:-
Sexual health
Substance misuse
Domestic abuse
Trafficking

More information below.
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('Support to access other services:-');
    expect(container.innerHTML).toContain('<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">');
    expect(container.innerHTML).toContain('<li>Sexual health</li>');
    expect(container.innerHTML).toContain('<li>Substance misuse</li>');
    expect(container.innerHTML).toContain('<li>Domestic abuse</li>');
    expect(container.innerHTML).toContain('<li>Trafficking</li>');
    expect(container.innerHTML).toContain('More information below.');
  });

  it('should preserve italic formatting while handling bullet points', () => {
    const content = `
* This is *italic* text in a bullet
* Another bullet with **bold** text
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    expect(container.innerHTML).toContain('<li>This is <em>italic</em> text in a bullet</li>');
    expect(container.innerHTML).toContain('<li>Another bullet with <strong>bold</strong> text</li>');
  });

  it('should handle single asterisk bullet points without treating them as italic', () => {
    const content = `
* Simple bullet
* Another bullet
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    // Should not wrap entire bullet content in em tags
    expect(container.innerHTML).not.toContain('<em>Simple bullet</em>');
    expect(container.innerHTML).toContain('<li>Simple bullet</li>');
  });

  it('should handle complex content with multiple bullet point patterns', () => {
    const content = `
Dental services include:
* Emergency dental care
* Routine checkups
* Teeth cleaning

We also provide the following:
Preventive care
Fillings and restorations
Oral health education

Additional services:
- Root canal treatment
- Extractions
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    // Should have bullet lists for asterisk bullets
    expect(container.innerHTML).toContain('<li>Emergency dental care</li>');
    expect(container.innerHTML).toContain('<li>Routine checkups</li>');
    expect(container.innerHTML).toContain('<li>Teeth cleaning</li>');
    
    // Should have bullets for "following:" pattern
    expect(container.innerHTML).toContain('<li>Preventive care</li>');
    expect(container.innerHTML).toContain('<li>Fillings and restorations</li>');
    expect(container.innerHTML).toContain('<li>Oral health education</li>');
    
    // Should have bullets for dash bullets
    expect(container.innerHTML).toContain('<li>Root canal treatment</li>');
    expect(container.innerHTML).toContain('<li>Extractions</li>');
  });

  it('should correctly distinguish between bullet asterisks and italic asterisks', () => {
    const content = `
* This is a bullet point
This is *italic* text
Another *word* in italics
* Another bullet point
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    // Should have bullet points
    expect(container.innerHTML).toContain('<li>This is a bullet point</li>');
    expect(container.innerHTML).toContain('<li>Another bullet point</li>');
    
    // Should have italic text (asterisks with no spaces around)
    expect(container.innerHTML).toContain('This is <em>italic</em> text');
    expect(container.innerHTML).toContain('Another <em>word</em> in italics');
    
    // Should NOT treat bullet asterisks as italic
    expect(container.innerHTML).not.toContain('<em>This is a bullet point</em>');
    expect(container.innerHTML).not.toContain('<em>Another bullet point</em>');
  });

  it('should handle various bullet point formats including HTML entities', () => {
    const content = `
* Standard bullet
&ast; HTML entity bullet
  * Indented bullet
• Unicode bullet
‣ Triangle bullet
    `.trim();

    const { container } = render(<MarkdownContent content={content} />);
    
    // Should convert all variations to bullet lists
    expect(container.innerHTML).toContain('<li>Standard bullet</li>');
    expect(container.innerHTML).toContain('<li>HTML entity bullet</li>');
    expect(container.innerHTML).toContain('<li>Indented bullet</li>');
    expect(container.innerHTML).toContain('<li>Unicode bullet</li>');
    expect(container.innerHTML).toContain('<li>Triangle bullet</li>');
  });
});