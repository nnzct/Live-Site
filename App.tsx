
import React, { useState, useEffect, useCallback } from 'react';
import { User, Stage, ExplorationLog } from './types';
import { INITIAL_STAGES } from './constants';
import Header from './components/Header';
import Landing from './components/Landing';
import PlanetList from './components/PlanetList';
import Explorer from './components/Explorer';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [logs, setLogs] = useState<ExplorationLog[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'list' | 'explorer' | 'admin' | 'profile'>('home');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  // Persistence logic (Simulation of concurrent site)
  useEffect(() => {
    const savedStages = localStorage.getItem('life_stages');
    const savedLogs = localStorage.getItem('life_logs');
    const savedUser = localStorage.getItem('life_user');

    if (savedStages) setStages(JSON.parse(savedStages));
    else setStages(INITIAL_STAGES);

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (stages.length > 0) localStorage.setItem('life_stages', JSON.stringify(stages));
    localStorage.setItem('life_logs', JSON.stringify(logs));
  }, [stages, logs]);

  const handleLogin = (nickname: string, isAdmin: boolean = false) => {
    const newUser = { nickname, isAdmin };
    setUser(newUser);
    localStorage.setItem('life_user', JSON.stringify(newUser));
    setCurrentView(isAdmin ? 'admin' : 'list');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('life_user');
    setCurrentView('home');
  };

  const updateStages = (newStages: Stage[]) => {
    setStages(newStages);
  };

  const addLog = (stageId: string, content: string) => {
    if (!user) return;
    const newLog: ExplorationLog = {
      id: Math.random().toString(36).substr(2, 9),
      stageId,
      nickname: user.nickname,
      content,
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const deleteLog = (logId: string) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  };

  const editLog = (logId: string, newContent: string) => {
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, content: newContent } : l));
  };

  const openExplorer = (stageId: string) => {
    setSelectedStageId(stageId);
    setCurrentView('explorer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {user && (
        <Header 
          user={user} 
          currentView={currentView}
          onNavigate={setCurrentView} 
          onLogout={handleLogout} 
        />
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {!user && <Landing onLogin={handleLogin} />}
        
        {user && currentView === 'list' && (
          <PlanetList 
            stages={stages.filter(s => s.isPublished || user.isAdmin)} 
            onSelect={openExplorer} 
          />
        )}

        {user && currentView === 'explorer' && selectedStageId && (
          <Explorer 
            stage={stages.find(s => s.id === selectedStageId)!} 
            logs={logs.filter(l => l.stageId === selectedStageId)}
            user={user}
            onAddLog={addLog}
            onDeleteLog={deleteLog}
            onEditLog={editLog}
            onBack={() => setCurrentView('list')}
          />
        )}

        {user && currentView === 'admin' && user.isAdmin && (
          <AdminDashboard 
            stages={stages} 
            onUpdateStages={updateStages} 
          />
        )}

        {user && currentView === 'profile' && (
          <ProfilePage 
            user={user} 
            logs={logs.filter(l => l.nickname === user.nickname)}
            stages={stages}
            onDeleteLog={deleteLog}
            onEditLog={editLog}
            onVisitStage={openExplorer}
          />
        )}
      </main>

      <footer className="py-6 text-center text-light-dim text-sm border-t border-dark-card glass mt-auto uppercase tracking-widest font-mono">
        &copy; 202X L.I.F.E. - LIFE INDEX FOR EVALUATION. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default App;
