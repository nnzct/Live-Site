
import React from 'react';
import { Stage } from '../types';

interface PlanetListProps {
  stages: Stage[];
  onSelect: (id: string) => void;
}

const PlanetList: React.FC<PlanetListProps> = ({ stages, onSelect }) => {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-primary/30 pb-4">
        <div>
          <h2 className="orbitron text-4xl font-black text-light tracking-tighter">DISCOVERED WORLDS</h2>
          <p className="text-primary-light uppercase tracking-widest text-xs mt-2">Active sector explorations in progress</p>
        </div>
        <div className="text-right">
          <span className="text-5xl orbitron font-bold text-secondary opacity-50">{stages.length}</span>
          <p className="text-[10px] uppercase text-light-dim">Planets Logged</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stages.map((stage) => (
          <div 
            key={stage.id} 
            className="group relative bg-dark-card border border-secondary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => onSelect(stage.id)}
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={stage.zones[0]?.imageUrl || `https://picsum.photos/seed/${stage.id}/800/400`} 
                alt={stage.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
              />
              {!stage.isPublished && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-600 text-[10px] font-bold text-white rounded">DRAFT</div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark to-transparent">
                <span className="text-xs font-mono text-primary font-bold">{stage.code}</span>
                <h3 className="orbitron text-xl font-bold text-white">{stage.name}</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-light-muted line-clamp-2 h-10">{stage.overview}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-light-dim uppercase tracking-widest font-bold">
                <div className="bg-dark p-2 rounded">GRAVITY: {stage.metadata.gravity}</div>
                <div className="bg-dark p-2 rounded">ATMOS: {stage.metadata.atmosphere.o2}% O2</div>
              </div>
              <button className="w-full py-2 bg-secondary/20 group-hover:bg-primary text-secondary group-hover:text-white transition-all text-xs font-bold uppercase tracking-widest rounded">
                Initiate Landing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanetList;
