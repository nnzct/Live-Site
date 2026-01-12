
import React, { useState } from 'react';
import { ExplorationLog, User } from '../types';

interface LogSectionProps {
  stageId: string;
  logs: ExplorationLog[];
  user: User;
  onAddLog: (stageId: string, content: string) => void;
  onDeleteLog: (id: string) => void;
  onEditLog: (id: string, content: string) => void;
}

const LogSection: React.FC<LogSectionProps> = ({ stageId, logs, user, onAddLog, onDeleteLog, onEditLog }) => {
  const [newLog, setNewLog] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    onAddLog(stageId, newLog);
    setNewLog('');
  };

  const handleStartEdit = (log: ExplorationLog) => {
    setEditingId(log.id);
    setEditingContent(log.content);
  };

  const handleSaveEdit = (id: string) => {
    onEditLog(id, editingContent);
    setEditingId(null);
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-between border-b border-primary/20 pb-2">
        <h3 className="orbitron text-xl font-bold text-light flex items-center">
          <span className="text-primary mr-3">_</span>MISSION LOGS
        </h3>
        <span className="text-[10px] text-light-dim font-mono uppercase font-bold">{logs.length}개의 탐사 기록 발견됨</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newLog}
          onChange={(e) => setNewLog(e.target.value)}
          placeholder="탐사 데이터를 전송하십시오..."
          className="w-full h-24 bg-dark-card border border-secondary/30 rounded p-4 text-sm text-light focus:border-primary outline-none transition-all placeholder:text-light-dim/50"
        />
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold text-xs uppercase tracking-widest rounded shadow-lg transition-all"
          >
            기록 전송하기
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-center py-10 text-light-dim text-sm italic font-mono uppercase">해당 구역에 기록된 로그가 없습니다.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 border-l-2 border-secondary bg-dark-card/50 rounded-r shadow-sm flex flex-col space-y-2 animate-fade-in">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-primary-light uppercase tracking-widest">탐사원: {log.nickname}</span>
                <span className="text-light-dim font-mono">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              
              {editingId === log.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-dark border border-primary p-2 text-sm text-light font-mono"
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setEditingId(null)} className="text-[10px] text-light-dim hover:text-white uppercase font-bold">취소</button>
                    <button onClick={() => handleSaveEdit(log.id)} className="text-[10px] text-primary hover:text-primary-light uppercase font-bold">변경 사항 저장</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-light-muted leading-relaxed font-mono whitespace-pre-wrap">
                  {log.content}
                </p>
              )}

              {log.nickname === user.nickname && editingId !== log.id && (
                <div className="flex justify-end space-x-4 pt-2">
                  <button 
                    onClick={() => handleStartEdit(log)}
                    className="text-[10px] text-secondary hover:text-white uppercase font-bold transition-colors"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => onDeleteLog(log.id)}
                    className="text-[10px] text-red-500/70 hover:text-red-500 uppercase font-bold transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogSection;
