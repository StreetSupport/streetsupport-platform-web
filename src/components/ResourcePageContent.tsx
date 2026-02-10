'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Resource, LinkList } from '@/types/resources';
import FileDownloadLink from '@/components/ui/FileDownloadLink';
import { sanitiseCmsHtml } from '@/utils/sanitiseHtml';

interface ResourcePageContentProps {
  resource: Resource;
}

export default function ResourcePageContent({ resource }: ResourcePageContentProps) {
  // Render simple link list
  const renderLinkList = (linkList: LinkList) => (
    <div key={linkList.name}>
      <p className="font-semibold mb-6">{linkList.name}</p>
      <ul className="list-disc pl-6 space-y-2">
        {linkList.links.map((link, index) => (
          <li key={index}>
            <Link 
              href={link.link} 
              className="text-brand-a hover:text-brand-a underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render card-link list
  const renderCardLinkList = (linkList: LinkList) => (
    <div key={linkList.name}>
      <p className="font-semibold mb-6">{linkList.name}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linkList.links.map((link, index) => (
          <Link 
            key={index}
            href={link.link} 
            className="block transition-transform hover:scale-105"
            rel="noopener noreferrer"
          >
            <article className="card !bg-brand-i text-white hover:!bg-brand-q transition-all duration-200 p-6 h-full flex items-center justify-center text-center shadow-lg rounded-lg">
              <h3 className="heading-5 text-white">{link.title}</h3>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );

  // Render file-link list (detailed cards)
  const renderFileLinkList = (linkList: LinkList) => (
    <div key={linkList.name}>
      {linkList.name && (
        <h2 className="heading-3 mb-4">{linkList.name}</h2>
      )}
      
      <div className="space-y-8">
        {linkList.links.map((link, index) => (
          <section key={index}>
            {link.header && (
              <h2 className="heading-3 mb-4">{link.header}</h2>
            )}
            
            {link.description && (
              <p className="mb-4">{link.description}</p>
            )}
            
            <FileDownloadLink
              href={link.link}
              fileName={link.title}
              fileType={link.fileType || 'pdf'}
              context="user-guides"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {link.title}
            </FileDownloadLink>
          </section>
        ))}
      </div>
    </div>
  );

  const parsedBody = sanitiseCmsHtml(resource.body);

  return (
    <>
      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">{resource.header}</h1>
          {resource.shortDescription && (
            <p className="text-lead text-white">{resource.shortDescription}</p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="prose max-w-none">
          {/* Body Content */}
          {resource.body && (
            <div className="mb-8"
              dangerouslySetInnerHTML={{ __html: parsedBody }}
            />
          )}
          
          {/* Branding images - only show for branding resource */}
          {resource.key === 'branding' && (
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
              <Image 
                src="/assets/img/StreetSupport_logo_land.png" 
                alt="Street Support name logo" 
                width={300} 
                height={200} 
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <Image 
                src="/assets/img/logo.png" 
                alt="Street Support logo" 
                width={200} 
                height={200} 
                className="object-contain"
                priority
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>
          )}

          {resource.body && (
            <hr className="my-8 border-gray-300" />
          )}
          
          {/* Render Link Lists based on type */}
          {resource.linkList && resource.linkList.map((linkList, index) => (
            <div key={`${linkList.name}-${index}`} className='mb-4'>
              {index > 0 && <hr className="my-8 border-gray-300" />}
              
              {linkList.type === 'link' && renderLinkList(linkList)}
              {linkList.type === 'card-link' && renderCardLinkList(linkList)}
              {linkList.type === 'file-link' && renderFileLinkList(linkList)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
