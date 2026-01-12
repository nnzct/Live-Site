
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
    if (window.confirm('IRREVERSIBLE ACTION: Purge this planetary record?')) {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-primary/20 pb-4">
        <div>
          <h2 className="orbitron text-3xl font-bold text-white tracking-widest uppercase">Planetary Architect Terminal</h2>
          <p className="text-secondary-light text-xs font-mono">System Status: AUTHORIZED ACCESS</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded orbitron font-bold text-sm transition-all shadow-lg"
        >
          GENERATE NEW WORLD
        </button>
      </div>

      <div className="overflow-x-auto glass rounded-lg border border-secondary/20">
        <table className="w-full text-left">
          <thead className="bg-dark text-primary-light uppercase text-xs orbitron font-bold">
            <tr>
              <th className="p-4">Planet Name</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Status</th>
              <th className="p-4">Zones</th>
              <th className="p-4 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {stages.map(stage => (
              <tr key={stage.id} className="border-t border-secondary/10 hover:bg-dark-card/50 transition-colors">
                <td className="p-4 font-bold text-light">{stage.name}</td>
                <td className="p-4 font-mono text-secondary-light">{stage.code}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${stage.isPublished ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {stage.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-light-dim font-mono">{stage.zones.length}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => togglePublish(stage)} className="text-xs text-secondary hover:text-white uppercase font-bold underline">
                    {stage.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleEdit(stage)} className="text-xs text-primary-light hover:text-white uppercase font-bold underline">Edit</button>
                  <button onClick={() => handleDelete(stage.id)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold underline">Delete</button>
                </td>
              </tr>
            ))}
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
