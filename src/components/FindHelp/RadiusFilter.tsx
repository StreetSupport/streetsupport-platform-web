'use client';

import React from 'react';

interface RadiusFilterProps {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  className?: string;
}

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
];

export default function RadiusFilter({ selectedRadius, onRadiusChange, className }: RadiusFilterProps) {
  return (
    <select
      id="radius-filter"
      value={selectedRadius}
      onChange={(e) => onRadiusChange(Number(e.target.value))}
      className={className || "border border-brand-q px-2 py-1 rounded focus:ring-2 focus:ring-brand-a focus:border-brand-a"}
      aria-label="Select search radius"
    >
      {RADIUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}