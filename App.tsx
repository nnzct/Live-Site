
import React, { useState, useEffect, useCallback } from 'react';
import { User, Stage, ExplorationLog } from './types';
import { INITIAL_STAGES } from './constants';
import Header from './components/Header';
import Landing from './components/Landing';
import PlanetList from './components/PlanetList';
import Explorer from './components/Explorer';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';

// 실시간 동기화를 위한 채널 설정
const syncChannel = new BroadcastChannel('life_sync_system');

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [logs, setLogs] = useState<ExplorationLog[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'explorer' | 'admin' | 'profile'>('list');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  // 데이터 로드 및 동기화 리스너
  const loadData = useCallback(() => {
    const savedStages = localStorage.getItem('life_stages_shared');
    const savedLogs = localStorage.getItem('life_logs_shared');
    
    if (savedStages) setStages(JSON.parse(savedStages));
    else setStages(INITIAL_STAGES);
    
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    loadData();
    const savedUser = localStorage.getItem('life_user_local');
    if (savedUser) setUser(JSON.parse(savedUser));

    // 다른 탭에서 발생한 변화 감지
    const handleSync = (event: MessageEvent) => {
      if (event.data === 'update_request') {
        loadData();
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [loadData]);

  // 데이터 변경 시 로컬스토리지 저장 및 타 탭 알림
  const persistAndSync = (newStages?: Stage[], newLogs?: ExplorationLog[]) => {
    if (newStages) {
      setStages(newStages);
      localStorage.setItem('life_stages_shared', JSON.stringify(newStages));
    }
    if (newLogs) {
      setLogs(newLogs);
      localStorage.setItem('life_logs_shared', JSON.stringify(newLogs));
    }
    syncChannel.postMessage('update_request');
  };

  const handleLogin = (nickname: string, isAdmin: boolean = false) => {
    const newUser = { nickname, isAdmin };
    setUser(newUser);
    localStorage.setItem('life_user_local', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('life_user_local');
    setCurrentView('list');
  };

  const handleUpdateStages = (updatedStages: Stage[]) => {
    persistAndSync(updatedStages, undefined);
  };

  const handleAddLog = (stageId: string, content: string) => {
    if (!user) return;
    const newLog: ExplorationLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      stageId,
      nickname: user.nickname,
      content,
      timestamp: Date.now()
    };
    const updatedLogs = [newLog, ...logs];
    persistAndSync(undefined, updatedLogs);
  };

  const handleDeleteLog = (logId: string) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    persistAndSync(undefined, updatedLogs);
  };

  const handleEditLog = (logId: string, newContent: string) => {
    const updatedLogs = logs.map(l => l.id === logId ? { ...l, content: newContent } : l);
    persistAndSync(undefined, updatedLogs);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark selection:bg-primary selection:text-white">
      {user && (
        <Header 
          user={user} 
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)} 
          onLogout={handleLogout} 
        />
      )}

      <main className="flex-grow container mx-auto px-6 py-10">
        {!user ? (
          <Landing onLogin={handleLogin} />
        ) : (
          <div className="animate-fade-in">
            {currentView === 'list' && (
              <PlanetList 
                stages={stages.filter(s => s.isPublished || user.isAdmin)} 
                onSelect={(id) => { setSelectedStageId(id); setCurrentView('explorer'); }} 
              />
            )}

            {currentView === 'explorer' && selectedStageId && (
              <Explorer 
                stage={stages.find(s => s.id === selectedStageId)!} 
                logs={logs.filter(l => l.stageId === selectedStageId)}
                user={user}
                onAddLog={handleAddLog}
                onDeleteLog={handleDeleteLog}
                onEditLog={handleEditLog}
                onBack={() => setCurrentView('list')}
              />
            )}

            {currentView === 'admin' && user.isAdmin && (
              <AdminDashboard 
                stages={stages} 
                onUpdateStages={handleUpdateStages} 
              />
            )}

            {currentView === 'profile' && (
              <ProfilePage 
                user={user} 
                logs={logs.filter(l => l.nickname === user.nickname)}
                stages={stages}
                onDeleteLog={handleDeleteLog}
                onEditLog={handleEditLog}
                onVisitStage={(id) => { setSelectedStageId(id); setCurrentView('explorer'); }}
              />
            )}
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-secondary/10 glass text-center">
        <p className="orbitron text-[9px] tracking-[0.5em] text-secondary-muted uppercase">
          Terminal Status: Online // System: L.I.F.E. Shared Network
        </p>
      </footer>
    </div>
  );
};

export default App;
