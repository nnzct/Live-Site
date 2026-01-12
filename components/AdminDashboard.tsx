
import React, { useState } from 'react';
import { Stage, Zone, Hotspot } from '../types';
import PlanetForm from './PlanetForm';

interface AdminDashboardProps {
  stages: Stage[];
  onUpdateStages: (stages: Stage[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stages, onUpdateStages }) => {
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateNew = () => {
    const newStage: Stage = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      code: `CODE-${Math.floor(Math.random() * 1000)}`,
      overview: '',
      isPublished: false,
      createdAt: Date.now(),
      metadata: {
        formationTime: '', orbit: '', satellites: 0, gravity: '', diameter: '', landSeaRatio: '',
        geology: '', atmosphere: { o2: 21, n2: 78, other: '1%' }, internalStructure: '',
        rotationPeriod: '', revolutionPeriod: '', circulationSystem: ''
      },
      zones: []
    };
    setEditingStage(newStage);
    setIsFormOpen(true);
  };

  const handleEdit = (stage: Stage) => {
    setEditingStage({ ...stage });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('경고: 행성 기록을 영구히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onUpdateStages(stages.filter(s => s.id !== id));
    }
  };

  const handleSave = (stage: Stage) => {
    if (stages.some(s => s.id === stage.id)) {
      onUpdateStages(stages.map(s => s.id === stage.id ? stage : s));
    } else {
      onUpdateStages([...stages, stage]);
    }
    setIsFormOpen(false);
  };

  const togglePublish = (stage: Stage) => {
    onUpdateStages(stages.map(s => s.id === stage.id ? { ...s, isPublished: !s.isPublished } : s));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-primary/20 pb-4">
        <div>
          <h2 className="orbitron text-3xl font-bold text-white tracking-widest uppercase">Planetary Architect Terminal</h2>
          <p className="text-secondary-light text-xs font-bold uppercase mt-1">시스템 상태: 행성 관리 권한 승인됨</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded orbitron font-bold text-sm transition-all shadow-lg shadow-primary/20 uppercase"
        >
          신규 행성 생성
        </button>
      </div>

      <div className="overflow-x-auto glass rounded-lg border border-secondary/20">
        <table className="w-full text-left">
          <thead className="bg-dark text-primary-light uppercase text-xs orbitron font-bold">
            <tr>
              <th className="p-4">행성 명칭</th>
              <th className="p-4">식별 코드</th>
              <th className="p-4">상태</th>
              <th className="p-4">구역 수</th>
              <th className="p-4 text-right">제어 작업</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {stages.map(stage => (
              <tr key={stage.id} className="border-t border-secondary/10 hover:bg-dark-card/50 transition-colors">
                <td className="p-4 font-bold text-light">{stage.name || '(이름 없음)'}</td>
                <td className="p-4 font-mono text-secondary-light">{stage.code}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${stage.isPublished ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {stage.isPublished ? '공개 중' : '비공개'}
                  </span>
                </td>
                <td className="p-4 text-light-dim font-mono">{stage.zones.length}</td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => togglePublish(stage)} className="text-xs text-secondary hover:text-white uppercase font-bold underline transition-colors">
                    {stage.isPublished ? '비공개 전환' : '공개 전환'}
                  </button>
                  <button onClick={() => handleEdit(stage)} className="text-xs text-primary-light hover:text-white uppercase font-bold underline transition-colors">수정</button>
                  <button onClick={() => handleDelete(stage.id)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold underline transition-colors">삭제</button>
                </td>
              </tr>
            ))}
            {stages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-20 text-center text-light-dim uppercase font-bold tracking-widest italic">데이터베이스가 비어 있습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && editingStage && (
        <PlanetForm 
          stage={editingStage} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
