
import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface HeaderProps {
  user: User;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onNavigate, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/20 px-6 py-4 flex justify-between items-center">
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => onNavigate('list')}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Icons.Planet />
        </div>
        <h1 className="orbitron text-xl font-bold text-primary tracking-[0.2em]">
          L.I.F.E.
        </h1>
      </div>

      <nav className="flex items-center space-x-6">
        <button 
          onClick={() => onNavigate('list')}
          className={`flex items-center space-x-1 hover:text-primary transition-colors ${currentView === 'list' ? 'text-primary' : 'text-light'}`}
        >
          <span className="text-sm font-semibold uppercase tracking-wider">행성 탐사</span>
        </button>

        {user.isAdmin && (
          <button 
            onClick={() => onNavigate('admin')}
            className={`flex items-center space-x-1 hover:text-primary transition-colors ${currentView === 'admin' ? 'text-primary' : 'text-light'}`}
          >
            <span className="text-sm font-semibold uppercase tracking-wider">관리자 제어</span>
          </button>
        )}

        <button 
          onClick={() => onNavigate('profile')}
          className={`flex items-center space-x-1 hover:text-primary transition-colors ${currentView === 'profile' ? 'text-primary' : 'text-light'}`}
        >
          <span className="text-sm font-semibold uppercase tracking-wider">개인 터미널 ({user.nickname})</span>
        </button>

        <button 
          onClick={onLogout}
          className="px-4 py-1 border border-primary/50 text-primary hover:bg-primary hover:text-white rounded transition-all text-xs font-bold uppercase"
        >
          로그아웃
        </button>
      </nav>
    </header>
  );
};

export default Header;
