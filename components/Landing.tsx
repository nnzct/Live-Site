
import React, { useState } from 'react';

interface LandingProps {
  onLogin: (nickname: string, isAdmin?: boolean) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [nickname, setNickname] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    if (isAdminMode) {
      if (adminPassword === 'didEl!2003') {
        onLogin(nickname, true);
      } else {
        alert('ACCESS DENIED: INVALID ADMINISTRATIVE KEY');
      }
    } else {
      onLogin(nickname);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" 
          alt="Cosmos" 
          className="rounded-lg shadow-2xl relative border-2 border-primary/20 max-w-2xl w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg">
          <h1 className="orbitron text-7xl font-black text-white tracking-[0.2em] mb-4">L.I.F.E.</h1>
          <p className="text-primary-light uppercase tracking-[0.3em] text-xs font-bold">Life Index For Evaluation</p>
        </div>
      </div>

      <div className="w-full max-w-md glass p-8 rounded-xl border border-secondary/30">
        <h2 className="orbitron text-2xl text-center mb-8 text-light font-bold">IDENTITY AUTHENTICATION</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-light-dim mb-2">Explorer Nickname</label>
            <input 
              type="text" 
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-dark border-b-2 border-secondary focus:border-primary outline-none py-2 px-4 text-light transition-colors"
              placeholder="ENTER NICKNAME..."
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="adminMode" 
              checked={isAdminMode} 
              onChange={() => setIsAdminMode(!isAdminMode)}
              className="accent-primary"
            />
            <label htmlFor="adminMode" className="text-xs uppercase tracking-widest text-light-dim cursor-pointer">Administrative Access</label>
          </div>

          {isAdminMode && (
            <div className="animate-fade-in">
              <label className="block text-xs uppercase tracking-widest text-light-dim mb-2">Security Key</label>
              <input 
                type="password" 
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-dark border-b-2 border-secondary focus:border-primary outline-none py-2 px-4 text-light transition-colors"
                placeholder="PASSWORD..."
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white orbitron font-bold tracking-widest transition-all rounded shadow-lg shadow-primary/20"
          >
            INITIATE VOYAGE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
