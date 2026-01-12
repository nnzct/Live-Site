
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
        alert('보안 키가 올바르지 않습니다.');
      }
    } else {
      onLogin(nickname);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 glass border border-primary/20 rounded-2xl shadow-2xl">
      <div className="text-center mb-10">
        <h1 className="orbitron text-6xl font-black text-primary mb-2 tracking-tighter">L.I.F.E.</h1>
        <p className="orbitron text-[10px] text-light-dim tracking-[0.3em] uppercase">Life Index For Evaluation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-light-dim uppercase tracking-widest mb-2">탐사원 닉네임</label>
          <input 
            type="text" 
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-dark/50 border border-secondary/30 focus:border-primary px-4 py-3 rounded-lg text-white outline-none transition-all"
            placeholder="NICKNAME..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="adminToggle"
            checked={isAdminMode}
            onChange={() => setIsAdminMode(!isAdminMode)}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="adminToggle" className="text-[10px] font-bold text-light-dim cursor-pointer">관리자 권한 요청</label>
        </div>

        {isAdminMode && (
          <div className="animate-fade-in">
            <label className="block text-[10px] font-bold text-light-dim uppercase tracking-widest mb-2">관리자 보안 키</label>
            <input 
              type="password" 
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-dark/50 border border-secondary/30 focus:border-primary px-4 py-3 rounded-lg text-white outline-none transition-all"
              placeholder="PASSWORD..."
            />
          </div>
        )}

        <button 
          type="submit"
          className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold orbitron tracking-widest rounded-lg transition-all shadow-lg shadow-primary/20"
        >
          데이터 동기화 시작
        </button>
      </form>
    </div>
  );
};

export default Landing;
