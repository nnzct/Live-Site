
import React, { useState } from 'react';
import { Stage, User, ExplorationLog, Hotspot, EncounterChoice } from '../types';
import LogSection from './LogSection';

interface ExplorerProps {
  stage: Stage;
  logs: ExplorationLog[];
  user: User;
  onAddLog: (stageId: string, content: string) => void;
  onDeleteLog: (logId: string) => void;
  onEditLog: (logId: string, content: string) => void;
  onBack: () => void;
}

const Explorer: React.FC<ExplorerProps> = ({ 
  stage, logs, user, onAddLog, onDeleteLog, onEditLog, onBack 
}) => {
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [activeEncounter, setActiveEncounter] = useState<Hotspot | null>(null);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [encounterResult, setEncounterResult] = useState<string | null>(null);

  const currentZone = stage.zones[currentZoneIndex] || { name: '알 수 없음', hotspots: [], imageUrl: '' };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'encounter') {
      setActiveEncounter(hotspot);
      setEncounterResult(null);
    } else {
      setActiveInfo(hotspot.content);
    }
  };

  const handleChoice = (choice: EncounterChoice) => {
    setEncounterResult(choice.response);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in max-w-7xl mx-auto">
      {/* HUD 상단 */}
      <div className="flex justify-between items-center border-b border-secondary/20 pb-6 glass px-6 py-4 rounded-t-xl terminal-border">
        <button onClick={onBack} className="text-primary hover:text-white transition-all uppercase text-[10px] font-bold tracking-[0.3em] flex items-center">
          <span className="mr-2">◀</span> ABORT MISSION
        </button>
        <div className="text-center">
          <h2 className="orbitron text-3xl font-black text-white tracking-widest uppercase">{stage.name} <span className="text-primary mx-2">//</span> {currentZone.name}</h2>
          <p className="text-[10px] text-secondary font-mono tracking-[0.5em] mt-1 opacity-70">LOCATION_SECTOR: {stage.code} / ZONE_ID: {currentZoneIndex + 1}</p>
        </div>
        <div className="flex flex-col items-end text-[10px] font-mono text-secondary-muted uppercase font-bold">
          <span>STATUS: EXPLORING</span>
          <span className="text-primary animate-pulse">SIGNAL: SYNCED</span>
        </div>
      </div>

      {/* 시네마틱 메인 뷰포트 (21:9 비율) */}
      <div className="relative group overflow-hidden rounded-xl border-x border-b border-secondary/20 shadow-2xl">
        <div className="w-full aspect-[21/9] bg-black relative scanner">
          {currentZone.imageUrl ? (
            <img 
              src={currentZone.imageUrl} 
              alt={currentZone.name} 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary-muted orbitron italic">NO VISUAL DATA</div>
          )}
          
          {/* 포인트 앤 클릭 핫스팟 */}
          {!activeEncounter && !activeInfo && currentZone.hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center group/hs z-20"
            >
              <div className="w-full h-full rounded-full border border-primary/50 animate-ping absolute opacity-50"></div>
              <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary flex items-center justify-center group-hover/hs:bg-primary transition-all relative">
                <span className="text-[8px] font-bold text-white">{hs.type === 'encounter' ? '!' : '?'}</span>
              </div>
              <div className="absolute top-12 bg-dark border border-primary/30 text-white text-[9px] px-3 py-1.5 rounded-full opacity-0 group-hover/hs:opacity-100 transition-all whitespace-nowrap z-30 uppercase font-bold tracking-widest">
                {hs.label}
              </div>
            </button>
          ))}

          {/* 조우 이벤트 모달 */}
          {activeEncounter && (
            <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center p-8 z-40 animate-fade-in">
              <div className="max-w-2xl w-full bg-dark-card border border-primary p-8 rounded-lg shadow-[0_0_50px_rgba(255,54,0,0.15)]">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-6 bg-primary"></div>
                  <h3 className="orbitron text-primary text-xl font-black uppercase tracking-widest">Unknown Lifeform Detected</h3>
                </div>
                <p className="text-light text-lg leading-relaxed mb-8 font-light italic">"{activeEncounter.content}"</p>
                
                {encounterResult ? (
                  <div className="space-y-8 animate-fade-in">
                    <div className="p-6 bg-secondary/5 border-l-4 border-secondary rounded">
                      <p className="text-secondary-light font-bold text-sm leading-relaxed">{encounterResult}</p>
                    </div>
                    <button 
                      onClick={() => setActiveEncounter(null)}
                      className="w-full py-4 bg-primary text-white orbitron font-bold text-sm tracking-[0.5em] rounded hover:bg-primary-dark transition-all active-glow"
                    >
                      RESUME EXPLORATION
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {activeEncounter.choices?.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="p-5 border border-secondary/30 hover:bg-primary/10 text-left text-sm font-semibold transition-all hover:border-primary group flex items-center"
                      >
                        <span className="text-primary opacity-0 group-hover:opacity-100 mr-3 transition-all">▶</span> {choice.text}
                      </button>
                    ))}
                    {(!activeEncounter.choices || activeEncounter.choices.length === 0) && (
                      <button onClick={() => setActiveEncounter(null)} className="p-4 border border-secondary text-center text-xs text-secondary hover:text-white transition-all">그대로 지나간다</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 정보 알림창 */}
          {activeInfo && (
            <div className="absolute bottom-10 left-10 right-10 flex justify-center z-40 animate-slide-up">
              <div className="max-w-2xl w-full glass border-l-4 border-primary p-6 flex justify-between items-center shadow-2xl">
                <p className="text-sm font-medium text-light leading-relaxed">{activeInfo}</p>
                <button onClick={() => setActiveInfo(null)} className="text-primary hover:text-white ml-8 text-2xl font-light">×</button>
              </div>
            </div>
          )}
        </div>

        {/* 구역 네비게이션 */}
        <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
          <button 
            disabled={currentZoneIndex === 0}
            onClick={() => setCurrentZoneIndex(prev => prev - 1)}
            className="p-4 rounded-full bg-dark/40 text-white hover:bg-primary/80 transition-all disabled:opacity-0 pointer-events-auto border border-white/10"
          >
            ◀
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
          <button 
            disabled={currentZoneIndex === stage.zones.length - 1}
            onClick={() => setCurrentZoneIndex(prev => prev + 1)}
            className="p-4 rounded-full bg-dark/40 text-white hover:bg-primary/80 transition-all disabled:opacity-0 pointer-events-auto border border-white/10"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 행성 세부 제원 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 glass p-8 rounded-xl border border-secondary/20 shadow-inner">
          <h3 className="orbitron text-xs text-primary font-bold mb-6 flex items-center uppercase tracking-widest">
            <span className="w-4 h-0.5 bg-primary mr-3"></span> Physical Data
          </h3>
          <div className="space-y-5 text-[11px] font-bold">
            {[
              { label: '토양/바다 비율', val: stage.metadata.landSeaRatio },
              { label: '중력 가속도', val: stage.metadata.gravity },
              { label: '자전 주기', val: stage.metadata.rotationPeriod },
              { label: '공전 주기', val: stage.metadata.revolutionPeriod },
              { label: '행성 지름', val: stage.metadata.diameter },
              { label: '형성 시기', val: stage.metadata.formationTime }
            ].map((d, i) => (
              <div key={i} className="flex justify-between border-b border-secondary/10 pb-2">
                <span className="text-secondary-muted uppercase">{d.label}</span>
                <span className="text-light">{d.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 glass p-8 rounded-xl border border-secondary/20 shadow-inner">
           <div className="flex justify-between items-center mb-8">
              <h3 className="orbitron text-xs text-secondary font-bold uppercase tracking-widest flex items-center">
                <span className="w-4 h-0.5 bg-secondary mr-3"></span> Atmospheric Scan
              </h3>
              <div className="text-[9px] text-primary font-bold orbitron uppercase animate-pulse">Scanning... OK</div>
           </div>
           
           <div className="flex items-center h-12 w-full bg-dark rounded-full overflow-hidden mb-8 border border-secondary/20 p-1">
              <div style={{ width: `${stage.metadata.atmosphere.o2}%` }} className="h-full bg-primary flex items-center justify-center text-[10px] font-black text-white rounded-l-full shadow-[0_0_10px_rgba(255,54,0,0.3)]">O2 {stage.metadata.atmosphere.o2}%</div>
              <div style={{ width: `${stage.metadata.atmosphere.n2}%` }} className="h-full bg-secondary flex items-center justify-center text-[10px] font-black text-white">N2 {stage.metadata.atmosphere.n2}%</div>
              <div className="flex-grow h-full bg-dark-card flex items-center justify-center text-[9px] font-bold text-secondary-muted rounded-r-full">OTHER</div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <span className="block text-[10px] text-primary font-black uppercase tracking-widest border-l-2 border-primary pl-3">Geological Composition</span>
                <p className="text-sm text-light-muted leading-relaxed italic">{stage.metadata.geology}</p>
              </div>
              <div className="space-y-3">
                <span className="block text-[10px] text-secondary font-black uppercase tracking-widest border-l-2 border-secondary pl-3">Planetary Circulation</span>
                <p className="text-sm text-light-muted leading-relaxed italic">{stage.metadata.circulationSystem}</p>
              </div>
           </div>
        </div>
      </div>

      {/* 탐사 기록 섹션 */}
      <div className="glass rounded-xl border border-secondary/10 p-2">
        <LogSection 
          stageId={stage.id} 
          logs={logs} 
          user={user} 
          onAddLog={onAddLog} 
          onDeleteLog={onDeleteLog}
          onEditLog={onEditLog}
        />
      </div>
    </div>
  );
};

export default Explorer;
