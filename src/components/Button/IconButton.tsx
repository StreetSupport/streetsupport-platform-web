'use client';

import React from 'react';

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export default function IconButton({ icon, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-block text-center overflow-hidden rounded-lg shadow-md hover:opacity-90 transition"
    >
      <div className="w-full bg-gradient-to-b from-[#ADE1F9] to-white rounded-t-lg">
        <div className="w-full h-[110px] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="block font-headline font-bold bg-white px-5 py-3 rounded-b-lg">
        {label}
      </span>
    </button>
  );
}
