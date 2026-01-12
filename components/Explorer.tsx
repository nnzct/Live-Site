
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

  const currentZone = stage.zones[currentZoneIndex];

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
    <div className="space-y-8 pb-20">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-secondary/30 pb-4">
        <button onClick={onBack} className="text-primary hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
          &larr; Abort Mission
        </button>
        <div className="text-center">
          <h2 className="orbitron text-2xl font-bold text-white uppercase">{stage.name} / {currentZone.name}</h2>
          <p className="text-xs text-secondary-light font-mono tracking-widest">{stage.code} STAGE_{currentZoneIndex + 1}</p>
        </div>
        <div className="text-right text-xs font-mono text-light-dim">
          LAT: 42.1124 | LON: -88.1923
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative group">
        <div className="w-full aspect-[21/9] bg-black rounded-lg overflow-hidden border-2 border-secondary/30 relative shadow-2xl shadow-primary/5">
          <img 
            src={currentZone.imageUrl} 
            alt={currentZone.name} 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-dark/20 opacity-40"></div>
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="w-24 h-24 border-l border-t border-primary/60 opacity-50"></div>
          </div>
          <div className="absolute bottom-4 right-4 pointer-events-none">
            <div className="w-24 h-24 border-r border-b border-primary/60 opacity-50"></div>
          </div>

          {/* Interaction Hotspots */}
          {!activeEncounter && !activeInfo && currentZone.hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center group/btn"
            >
              <div className="w-full h-full rounded-full border-2 border-primary animate-ping opacity-75 absolute"></div>
              <div className="w-4 h-4 rounded-full bg-primary/80 group-hover/btn:bg-primary transition-colors relative flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">{hs.type === 'encounter' ? '!' : '?'}</span>
              </div>
              <div className="absolute top-10 bg-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap border border-primary/40">
                {hs.label}
              </div>
            </button>
          ))}

          {/* Encounter Modal */}
          {activeEncounter && (
            <div className="absolute inset-0 glass flex items-center justify-center p-8 z-20">
              <div className="max-w-xl w-full bg-dark-card border-2 border-primary p-6 rounded-lg shadow-2xl animate-scale-in">
                <h3 className="orbitron text-primary text-xl font-bold mb-4 uppercase tracking-tighter">UNKNOWN SIGNAL DETECTED</h3>
                <p className="text-light leading-relaxed mb-6 italic">"{activeEncounter.content}"</p>
                
                {encounterResult ? (
                  <div className="space-y-6">
                    <p className="text-secondary-light font-bold border-l-2 border-secondary pl-4 py-2">{encounterResult}</p>
                    <button 
                      onClick={() => setActiveEncounter(null)}
                      className="w-full py-2 bg-primary text-white orbitron font-bold text-sm tracking-widest rounded"
                    >
                      CONTINUE EXPLORATION
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {activeEncounter.choices?.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="p-4 border border-secondary hover:bg-secondary/10 text-left text-sm font-semibold transition-all hover:border-primary group"
                      >
                        <span className="text-primary group-hover:text-white mr-2">▶</span> {choice.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Overlay */}
          {activeInfo && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-lg w-full glass border-l-4 border-primary p-4 animate-slide-up">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-light">{activeInfo}</p>
                <button onClick={() => setActiveInfo(null)} className="text-primary-light hover:text-white ml-4 text-lg">×</button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <button 
            disabled={currentZoneIndex === 0}
            onClick={() => setCurrentZoneIndex(prev => prev - 1)}
            className="p-4 rounded-full bg-dark/50 text-white hover:bg-primary/80 transition-all disabled:opacity-20"
          >
            &larr;
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <button 
            disabled={currentZoneIndex === stage.zones.length - 1}
            onClick={() => setCurrentZoneIndex(prev => prev + 1)}
            className="p-4 rounded-full bg-dark/50 text-white hover:bg-primary/80 transition-all disabled:opacity-20"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Planet Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass p-6 rounded-lg border border-secondary/20">
          <h3 className="orbitron text-lg text-primary font-bold mb-4 flex items-center">
            <span className="mr-2">SCANNER DATA</span>
          </h3>
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex justify-between border-b border-dark py-1">
              <span className="text-light-dim uppercase">Land/Sea Ratio</span>
              <span className="text-secondary-light">{stage.metadata.landSeaRatio}</span>
            </div>
            <div className="flex justify-between border-b border-dark py-1">
              <span className="text-light-dim uppercase">Gravity</span>
              <span className="text-secondary-light">{stage.metadata.gravity}</span>
            </div>
            <div className="flex justify-between border-b border-dark py-1">
              <span className="text-light-dim uppercase">Rotation</span>
              <span className="text-secondary-light">{stage.metadata.rotationPeriod}</span>
            </div>
            <div className="flex justify-between border-b border-dark py-1">
              <span className="text-light-dim uppercase">Diameter</span>
              <span className="text-secondary-light">{stage.metadata.diameter}</span>
            </div>
            <div className="flex justify-between border-b border-dark py-1">
              <span className="text-light-dim uppercase">Formation</span>
              <span className="text-secondary-light">{stage.metadata.formationTime}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass p-6 rounded-lg border border-secondary/20">
           <div className="flex justify-between items-center mb-4">
              <h3 className="orbitron text-lg text-secondary-light font-bold">ATMOSPHERIC ANALYSIS</h3>
              <div className="text-[10px] text-primary-light">CRITICAL O2 LEVELS: STABLE</div>
           </div>
           <div className="flex items-center h-8 w-full bg-dark rounded overflow-hidden mb-4 border border-secondary/20">
              <div style={{ width: `${stage.metadata.atmosphere.o2}%` }} className="h-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">O2: {stage.metadata.atmosphere.o2}%</div>
              <div style={{ width: `${stage.metadata.atmosphere.n2}%` }} className="h-full bg-secondary flex items-center justify-center text-[10px] font-bold text-white">N2: {stage.metadata.atmosphere.n2}%</div>
              <div style={{ width: `${100 - stage.metadata.atmosphere.o2 - stage.metadata.atmosphere.n2}%` }} className="h-full bg-light-dim flex items-center justify-center text-[10px] font-bold text-dark">OTHER</div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-primary-light font-bold uppercase mb-1">Geological Comp</span>
                <p className="text-light-muted">{stage.metadata.geology}</p>
              </div>
              <div>
                <span className="block text-primary-light font-bold uppercase mb-1">Internal Structure</span>
                <p className="text-light-muted">{stage.metadata.internalStructure}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Shared Logs */}
      <LogSection 
        stageId={stage.id} 
        logs={logs} 
        user={user} 
        onAddLog={onAddLog} 
        onDeleteLog={onDeleteLog}
        onEditLog={onEditLog}
      />
    </div>
  );
};

export default Explorer;
