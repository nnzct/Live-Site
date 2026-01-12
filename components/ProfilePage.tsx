
import React, { useState } from 'react';
import { User, ExplorationLog, Stage } from '../types';

interface ProfilePageProps {
  user: User;
  logs: ExplorationLog[];
  stages: Stage[];
  onDeleteLog: (id: string) => void;
  onEditLog: (id: string, content: string) => void;
  onVisitStage: (id: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, logs, stages, onDeleteLog, onEditLog, onVisitStage 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleStartEdit = (log: ExplorationLog) => {
    setEditingId(log.id);
    setEditingContent(log.content);
  };

  const handleSaveEdit = (id: string) => {
    onEditLog(id, editingContent);
    setEditingId(null);
  };

  const getPlanetName = (id: string) => stages.find(s => s.id === id)?.name || 'Unknown Sector';

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="flex items-center space-x-6 border-b border-primary/20 pb-8">
        <div className="w-24 h-24 rounded-full bg-dark-card border-4 border-primary flex items-center justify-center text-4xl orbitron text-primary">
          {user.nickname[0].toUpperCase()}
        </div>
        <div>
          <h2 className="orbitron text-4xl font-black text-white">{user.nickname}</h2>
          <p className="text-secondary-light uppercase tracking-[0.3em] text-xs mt-1">
            Certified Explorer #{Math.floor(Math.random() * 9999)}
          </p>
          <div className="flex space-x-4 mt-4 text-[10px] font-bold text-light-dim">
            <span className="bg-dark px-3 py-1 rounded">LOGS: {logs.length}</span>
            <span className="bg-dark px-3 py-1 rounded">RANK: SENIOR ANALYST</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="orbitron text-2xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Personal Transmission Archive</h3>
        
        {logs.length === 0 ? (
          <div className="py-20 text-center glass rounded-lg border border-secondary/20">
            <p className="text-light-dim font-mono italic">NO RECORDS FOUND IN ARCHIVE.</p>
            <button 
              onClick={() => onVisitStage('1')} 
              className="mt-4 text-primary font-bold uppercase text-xs hover:underline"
            >
              Start Your First Mission
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="p-6 glass rounded-lg border border-secondary/10 flex flex-col space-y-4 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <button 
                      onClick={() => onVisitStage(log.stageId)}
                      className="text-primary-light hover:text-white orbitron text-sm font-bold transition-colors"
                    >
                      SECTOR: {getPlanetName(log.stageId)}
                    </button>
                    <p className="text-[10px] text-light-dim font-mono mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => handleStartEdit(log)} className="text-[10px] text-secondary hover:underline uppercase font-bold">Edit</button>
                    <button onClick={() => onDeleteLog(log.id)} className="text-[10px] text-red-500 hover:underline uppercase font-bold">Purge</button>
                  </div>
                </div>

                {editingId === log.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-dark border border-primary p-3 text-sm text-light font-mono"
                    />
                    <div className="flex justify-end space-x-3">
                      <button onClick={() => setEditingId(null)} className="text-[10px] uppercase text-light-dim">Cancel</button>
                      <button onClick={() => handleSaveEdit(log.id)} className="text-[10px] uppercase text-primary font-bold">Commit Changes</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-light leading-relaxed italic font-mono opacity-90">
                    "{log.content}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
