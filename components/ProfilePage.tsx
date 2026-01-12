
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

  const getPlanetName = (id: string) => stages.find(s => s.id === id)?.name || '알 수 없는 행성';

  return (
    <div className="space-y-12 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-8 border-b border-primary/20 pb-10">
        <div className="w-24 h-24 rounded-full bg-dark-card border-4 border-primary flex items-center justify-center text-5xl orbitron text-primary shadow-lg shadow-primary/20">
          {user.nickname[0].toUpperCase()}
        </div>
        <div>
          <h2 className="orbitron text-5xl font-black text-white">{user.nickname}</h2>
          <p className="text-secondary-light uppercase tracking-[0.4em] text-xs mt-2 font-bold">
            정규 탐사원 인증됨 (CERTIFIED EXPLORER)
          </p>
          <div className="flex space-x-4 mt-6 text-[10px] font-bold text-light-dim uppercase">
            <span className="bg-dark px-4 py-2 rounded border border-secondary/10">총 탐사 로그: {logs.length}개</span>
            <span className="bg-dark px-4 py-2 rounded border border-secondary/10">등급: 수석 분석관</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="orbitron text-2xl font-bold text-white uppercase tracking-wider border-l-4 border-primary pl-4">Personal Transmission Archive</h3>
        <p className="text-light-dim text-xs font-bold -mt-4 uppercase">개인 탐사 기록 보관소</p>
        
        {logs.length === 0 ? (
          <div className="py-24 text-center glass rounded-lg border border-secondary/20">
            <p className="text-light-dim font-mono italic uppercase tracking-widest">저장된 기록이 없습니다.</p>
            <button 
              onClick={() => onVisitStage(stages[0]?.id || '1')} 
              className="mt-6 text-primary font-bold uppercase text-xs hover:underline tracking-widest"
            >
              첫 번째 임무 시작하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="p-6 glass rounded-lg border border-secondary/10 flex flex-col space-y-4 hover:border-primary/30 transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <button 
                      onClick={() => onVisitStage(log.stageId)}
                      className="text-primary-light hover:text-white orbitron text-sm font-bold transition-colors uppercase tracking-widest"
                    >
                      행성: {getPlanetName(log.stageId)}
                    </button>
                    <p className="text-[10px] text-light-dim font-mono mt-2">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-6">
                    <button onClick={() => handleStartEdit(log)} className="text-[10px] text-secondary hover:text-white uppercase font-bold underline transition-colors">수정</button>
                    <button onClick={() => onDeleteLog(log.id)} className="text-[10px] text-red-500 hover:text-white uppercase font-bold underline transition-colors">삭제</button>
                  </div>
                </div>

                {editingId === log.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-dark border border-primary p-4 text-sm text-light font-mono focus:outline-none"
                    />
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => setEditingId(null)} className="text-[10px] uppercase text-light-dim font-bold">취소</button>
                      <button onClick={() => handleSaveEdit(log.id)} className="text-[10px] uppercase text-primary font-bold">변경 저장</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-light-muted leading-relaxed font-mono whitespace-pre-wrap italic">
                    {log.content}
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
