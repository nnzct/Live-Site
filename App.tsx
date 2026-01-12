
import React, { useState, useEffect } from 'react';
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
  const [currentView, setCurrentView] = useState<'list' | 'explorer' | 'admin' | 'profile'>('list');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  useEffect(() => {
    const savedStages = localStorage.getItem('life_stages_v2');
    const savedLogs = localStorage.getItem('life_logs_v2');
    const savedUser = localStorage.getItem('life_user_v2');

    if (savedStages) setStages(JSON.parse(savedStages));
    else setStages(INITIAL_STAGES);

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (stages.length > 0) localStorage.setItem('life_stages_v2', JSON.stringify(stages));
    localStorage.setItem('life_logs_v2', JSON.stringify(logs));
  }, [stages, logs]);

  const handleLogin = (nickname: string, isAdmin: boolean = false) => {
    const newUser = { nickname, isAdmin };
    setUser(newUser);
    localStorage.setItem('life_user_v2', JSON.stringify(newUser));
    setCurrentView(isAdmin ? 'admin' : 'list');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('life_user_v2');
    setCurrentView('list');
  };

  const addLog = (stageId: string, content: string) => {
    if (!user) return;
    const newLog: ExplorationLog = {
      id: Date.now().toString(),
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

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white">
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
          <>
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
                onAddLog={addLog}
                onDeleteLog={deleteLog}
                onEditLog={editLog}
                onBack={() => setCurrentView('list')}
              />
            )}

            {currentView === 'admin' && user.isAdmin && (
              <AdminDashboard 
                stages={stages} 
                onUpdateStages={setStages} 
              />
            )}

            {currentView === 'profile' && (
              <ProfilePage 
                user={user} 
                logs={logs.filter(l => l.nickname === user.nickname)}
                stages={stages}
                onDeleteLog={deleteLog}
                onEditLog={editLog}
                onVisitStage={(id) => { setSelectedStageId(id); setCurrentView('explorer'); }}
              />
            )}
          </>
        )}
      </main>

      <footer className="py-8 border-t border-dark-card glass text-center">
        <p className="orbitron text-[10px] tracking-[0.4em] text-light-dim">
          &copy; 202X L.I.F.E. - LIFE INDEX FOR EVALUATION. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default App;
