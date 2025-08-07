'use client';

import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  link?: string;
}

interface NewsSectionProps {
  posts: NewsPost[];
  className?: string;
}

export default function NewsSection({ posts, className }: NewsSectionProps) {
  return (
    <section className={clsx('mt-5', className)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
        {posts.map(({ id, title, excerpt, imageUrl, link }, i) => (
          <article
            key={id}
            className={clsx(
              'pb-4 border-b border-brand-f sm:w-full md:w-[calc(33.333%-1rem)] md:mr-4',
              i % 3 === 2 && 'md:mr-0'
            )}
          >
            {imageUrl ? (
              <div className="relative float-left w-[90px] max-h-[90px] mr-2 sm:float-none sm:w-full sm:aspect-[2/1] sm:mb-2 border border-brand-h">
                <Image
                  src={imageUrl}
                  alt={`News image for: ${title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 90px"
                />
              </div>
            ) : (
              <div className="float-left w-[90px] h-[90px] mr-2 bg-brand-b sm:float-none sm:w-full sm:aspect-[2/1] sm:mb-2" />
            )}

            <h3 className="font-headline text-lg">
              {link ? (
                <a href={link} className="text-brand-b hover:underline">
                  {title}
                </a>
              ) : (
                title
              )}
            </h3>
            <p className="text-sm">{excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
