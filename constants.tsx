
import React from 'react';
import { Stage } from './types';

export const INITIAL_STAGES: Stage[] = [
  {
    id: '1',
    name: 'Aethelgard Prime',
    code: 'AE-001',
    overview: '빛나는 수정 숲으로 뒤덮인 신비로운 행성입니다. 지표면 전체가 에메랄드 빛 결정을 띠고 있습니다.',
    isPublished: true,
    createdAt: Date.now(),
    metadata: {
      formationTime: '42억 년',
      orbit: '원형 궤도, 1.2 AU',
      satellites: 2,
      gravity: '0.98g',
      diameter: '12,500 km',
      landSeaRatio: '40:60',
      geology: '석영 맥이 포함된 규산염 지각',
      atmosphere: { o2: 23, n2: 74, other: '3% 아르곤' },
      internalStructure: '용융된 철 핵',
      rotationPeriod: '26시간',
      revolutionPeriod: '410일',
      circulationSystem: '이중 해들리 순환'
    },
    zones: [
      {
        id: 'z1',
        name: '수정 해안',
        imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        hotspots: [
          {
            id: 'h1',
            x: 30,
            y: 50,
            label: '기묘한 반짝임',
            type: 'info',
            content: '이곳의 모래는 잘게 부서진 에메랄드로 구성되어 있는 것 같습니다.'
          },
          {
            id: 'h2',
            x: 70,
            y: 40,
            label: '고대 모놀리스',
            type: 'encounter',
            content: '검은 흑요석 기둥이 당신이 다가감에 따라 윙윙거립니다. 머릿속에서 목소리가 들려옵니다.',
            choices: [
              { id: 'c1', text: '표면을 만져본다', response: '역사적인 데이터가 당신의 의식 속으로 쏟아져 들어옵니다.' },
              { id: 'c2', text: '뒤로 물러난다', response: '웅웅거리는 소리가 멈추고, 귀가 먹먹할 정도의 정적이 찾아옵니다.' }
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
