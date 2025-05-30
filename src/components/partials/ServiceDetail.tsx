'use client';

import React from 'react';
import clsx from 'clsx';

interface TimeEntry {
  label: string;
  times: string[];
}

interface ServiceDetailProps {
  title: string;
  audience?: string;
  addressList?: string[];
  telephone?: string;
  timetable?: TimeEntry[];
  children?: React.ReactNode;
  className?: string;
}

export default function ServiceDetail({
  title,
  audience,
  addressList = [],
  telephone,
  timetable = [],
  children,
  className,
}: ServiceDetailProps) {
  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="mt-0 text-2xl font-headline mb-4">{title}</h2>

      {children && (
        <div className="mb-4 print:hidden">
          {children}
        </div>
      )}

      {audience && (
        <div className="mb-5 text-brand-k font-medium">
          {audience}
        </div>
      )}

      {addressList.length > 0 && (
        <ul className="list-none p-0 mb-5">
          {addressList.map((line, i) => (
            <li key={i} className="inline mr-1">{line}</li>
          ))}
        </ul>
      )}

      {telephone && (
        <div className="mb-5 font-medium">
          Tel: <a href={`tel:${telephone}`} className="text-brand-b underline">{telephone}</a>
        </div>
      )}

      {timetable.length > 0 && (
        <ul className="clear-both p-0 m-0">
          {timetable.map(({ label, times }, i) => (
            <li key={i} className="flex flex-wrap mb-2">
              <span className="w-[120px] font-headline font-semibold">{label}</span>
              <span className="flex-1">{times.join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
