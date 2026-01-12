
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
        alert('접근 거부: 관리자 보안 키가 일치하지 않습니다.');
      }
    } else {
      onLogin(nickname);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="relative mb-16 text-center">
        <div className="absolute inset-0 bg-primary blur-[100px] opacity-10"></div>
        <h1 className="orbitron text-8xl font-black text-white tracking-[0.2em] mb-4 relative">L.I.F.E.</h1>
        <p className="text-primary-light uppercase tracking-[0.4em] text-sm font-bold relative">Life Index For Evaluation</p>
        <p className="text-light-dim text-xs mt-6 tracking-widest relative">심우주 탐사 및 생명 지표 평가 시스템</p>
      </div>

      <div className="w-full max-w-md glass p-10 rounded-xl border border-secondary/30 shadow-2xl">
        <h2 className="orbitron text-xl text-center mb-8 text-light font-bold tracking-widest">신원 인증</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-light-dim mb-2">탐사원 닉네임</label>
            <input 
              type="text" 
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-dark border-b border-secondary focus:border-primary outline-none py-3 px-4 text-light transition-colors"
              placeholder="닉네임을 입력하세요..."
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="adminMode" 
              checked={isAdminMode} 
              onChange={() => setIsAdminMode(!isAdminMode)}
              className="accent-primary w-4 h-4"
            />
            <label htmlFor="adminMode" className="text-[10px] uppercase tracking-widest text-light-dim cursor-pointer select-none">관리자 권한으로 접속</label>
          </div>

          {isAdminMode && (
            <div className="animate-fade-in">
              <label className="block text-[10px] uppercase tracking-widest text-light-dim mb-2">보안 키</label>
              <input 
                type="password" 
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-dark border-b border-secondary focus:border-primary outline-none py-3 px-4 text-light transition-colors"
                placeholder="관리자 암호 입력..."
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white orbitron font-bold tracking-widest transition-all rounded shadow-lg shadow-primary/20 mt-4"
          >
            항해 시작
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
