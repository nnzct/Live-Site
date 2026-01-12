
import React from 'react';
import { Stage } from './types';

export const INITIAL_STAGES: Stage[] = [
  {
    id: '1',
    name: 'Aethelgard Prime',
    code: 'AE-001',
    overview: 'A verdant world covered in glowing crystalline forests.',
    isPublished: true,
    createdAt: Date.now(),
    metadata: {
      formationTime: '4.2 Billion Years',
      orbit: 'Circular, 1.2 AU',
      satellites: 2,
      gravity: '0.98g',
      diameter: '12,500 km',
      landSeaRatio: '40:60',
      geology: 'Silicate crust with quartz veins',
      atmosphere: { o2: 23, n2: 74, other: '3% Argon' },
      internalStructure: 'Molten iron core',
      rotationPeriod: '26 hours',
      revolutionPeriod: '410 days',
      circulationSystem: 'Double Hadley cells'
    },
    zones: [
      {
        id: 'z1',
        name: 'Crystal Shores',
        imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        hotspots: [
          {
            id: 'h1',
            x: 30,
            y: 50,
            label: 'Strange Shimmer',
            type: 'info',
            content: 'The sand here seems to be composed of ground emeralds.'
          },
          {
            id: 'h2',
            x: 70,
            y: 40,
            label: 'Ancient Monolith',
            type: 'encounter',
            content: 'A tall obsidian pillar hums as you approach. A voice echoes in your mind.',
            choices: [
              { id: 'c1', text: 'Touch the surface', response: 'A surge of historical data floods your consciousness.' },
              { id: 'c2', text: 'Back away', response: 'The humming stops, and the silence is deafening.' }
            ]
          }
        ]
      }
    ]
  }
];

export const Icons = {
  Planet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Profile: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};
