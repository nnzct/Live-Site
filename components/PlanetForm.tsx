
import React, { useState } from 'react';
import { Stage, Zone, Hotspot, EncounterChoice } from '../types';

interface PlanetFormProps {
  stage: Stage;
  onSave: (stage: Stage) => void;
  onCancel: () => void;
}

const PlanetForm: React.FC<PlanetFormProps> = ({ stage: initialStage, onSave, onCancel }) => {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [activeTab, setActiveTab] = useState<'info' | 'metadata' | 'zones'>('info');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStage(prev => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStage(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [name]: value }
    }));
  };

  const handleAtmosphereChange = (key: 'o2' | 'n2', value: string) => {
    const numValue = parseInt(value) || 0;
    setStage(prev => ({
      ...prev,
      metadata: { 
        ...prev.metadata, 
        atmosphere: { ...prev.metadata.atmosphere, [key]: numValue } 
      }
    }));
  };

  const addZone = () => {
    const newZone: Zone = {
      id: Math.random().toString(36).substr(2, 5),
      name: `Zone ${stage.zones.length + 1}`,
      imageUrl: '',
      hotspots: []
    };
    setStage(prev => ({ ...prev, zones: [...prev.zones, newZone] }));
  };

  const updateZone = (index: number, key: keyof Zone, value: any) => {
    const newZones = [...stage.zones];
    newZones[index] = { ...newZones[index], [key]: value };
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  const removeZone = (index: number) => {
    setStage(prev => ({ ...prev, zones: prev.zones.filter((_, i) => i !== index) }));
  };

  const addHotspot = (zoneIndex: number) => {
    const newHotspot: Hotspot = {
      id: Math.random().toString(36).substr(2, 5),
      x: 50,
      y: 50,
      label: 'New Point',
      type: 'info',
      content: ''
    };
    const newZones = [...stage.zones];
    newZones[zoneIndex].hotspots.push(newHotspot);
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  const updateHotspot = (zoneIndex: number, hsIndex: number, updates: Partial<Hotspot>) => {
    const newZones = [...stage.zones];
    newZones[zoneIndex].hotspots[hsIndex] = { ...newZones[zoneIndex].hotspots[hsIndex], ...updates };
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  const addChoice = (zoneIndex: number, hsIndex: number) => {
    const newChoice: EncounterChoice = { id: Math.random().toString(36).substr(2, 5), text: '', response: '' };
    const newZones = [...stage.zones];
    const hs = newZones[zoneIndex].hotspots[hsIndex];
    if (!hs.choices) hs.choices = [];
    hs.choices.push(newChoice);
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border-2 border-primary/50 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="sticky top-0 glass border-b border-primary/30 p-4 flex justify-between items-center z-10">
          <h2 className="orbitron text-xl font-bold text-white uppercase">World Construction Module</h2>
          <div className="space-x-4">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-light-dim uppercase hover:text-white">Abort</button>
            <button 
              onClick={() => onSave(stage)}
              className="px-6 py-2 bg-primary text-white text-xs font-bold rounded orbitron"
            >
              COMMIT RECORDS
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-8 border-b border-dark">
            <button onClick={() => setActiveTab('info')} className={`pb-2 px-4 uppercase text-xs font-bold transition-all ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>Core Info</button>
            <button onClick={() => setActiveTab('metadata')} className={`pb-2 px-4 uppercase text-xs font-bold transition-all ${activeTab === 'metadata' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>Metadata Scans</button>
            <button onClick={() => setActiveTab('zones')} className={`pb-2 px-4 uppercase text-xs font-bold transition-all ${activeTab === 'zones' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>Landing Zones ({stage.zones.length})</button>
          </div>

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-secondary-light uppercase">Planet Name</span>
                  <input type="text" name="name" value={stage.name} onChange={handleChange} className="w-full bg-dark border border-secondary/30 p-2 text-white rounded mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-secondary-light uppercase">Sector Code</span>
                  <input type="text" name="code" value={stage.code} onChange={handleChange} className="w-full bg-dark border border-secondary/30 p-2 text-white rounded mt-1" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold text-secondary-light uppercase">Mission Overview</span>
                <textarea name="overview" value={stage.overview} onChange={handleChange} className="w-full h-32 bg-dark border border-secondary/30 p-2 text-white rounded mt-1" />
              </label>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-xs">
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Formation Age</span>
                <input name="formationTime" value={stage.metadata.formationTime} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Orbit Geometry</span>
                <input name="orbit" value={stage.metadata.orbit} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Gravity Level</span>
                <input name="gravity" value={stage.metadata.gravity} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Atmosphere O2%</span>
                <input type="number" value={stage.metadata.atmosphere.o2} onChange={(e) => handleAtmosphereChange('o2', e.target.value)} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Atmosphere N2%</span>
                <input type="number" value={stage.metadata.atmosphere.n2} onChange={(e) => handleAtmosphereChange('n2', e.target.value)} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold">Land/Sea Ratio</span>
                <input name="landSeaRatio" value={stage.metadata.landSeaRatio} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
              </label>
              <div className="md:col-span-3 space-y-4 pt-4">
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold">Geological Composition</span>
                    <input name="geology" value={stage.metadata.geology} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
                 </label>
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold">Planet Internal Structure</span>
                    <input name="internalStructure" value={stage.metadata.internalStructure} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-2 mt-1 rounded" />
                 </label>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-8 animate-fade-in pb-10">
              {stage.zones.map((zone, zIndex) => (
                <div key={zone.id} className="p-4 border border-secondary/20 rounded-lg bg-dark relative">
                  <button onClick={() => removeZone(zIndex)} className="absolute top-2 right-2 text-red-500 hover:text-white">Remove Zone</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold text-primary-light">Zone Name</span>
                      <input value={zone.name} onChange={(e) => updateZone(zIndex, 'name', e.target.value)} className="w-full bg-dark-card border border-secondary/30 p-2 text-white text-xs rounded mt-1" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold text-primary-light">Image URL</span>
                      <input value={zone.imageUrl} onChange={(e) => updateZone(zIndex, 'imageUrl', e.target.value)} className="w-full bg-dark-card border border-secondary/30 p-2 text-white text-xs rounded mt-1" />
                    </label>
                  </div>
                  
                  <div className="mt-4 border-t border-dark pt-4">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-[10px] uppercase font-bold text-secondary-light">Interaction Points</h4>
                       <button onClick={() => addHotspot(zIndex)} className="text-[10px] bg-secondary/20 px-2 py-1 hover:bg-secondary text-white rounded">Add Hotspot</button>
                    </div>
                    <div className="space-y-4">
                      {zone.hotspots.map((hs, hsIndex) => (
                        <div key={hs.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 border-l border-primary/40 pl-4 py-2">
                           <input placeholder="Label" value={hs.label} onChange={(e) => updateHotspot(zIndex, hsIndex, {label: e.target.value})} className="bg-dark border border-secondary/20 p-1 text-[10px]" />
                           <select value={hs.type} onChange={(e) => updateHotspot(zIndex, hsIndex, {type: e.target.value as any})} className="bg-dark border border-secondary/20 p-1 text-[10px]">
                              <option value="info">Information Point</option>
                              <option value="encounter">Encounter Event</option>
                           </select>
                           <input type="number" placeholder="X%" value={hs.x} onChange={(e) => updateHotspot(zIndex, hsIndex, {x: parseInt(e.target.value)})} className="bg-dark border border-secondary/20 p-1 text-[10px]" />
                           <input type="number" placeholder="Y%" value={hs.y} onChange={(e) => updateHotspot(zIndex, hsIndex, {y: parseInt(e.target.value)})} className="bg-dark border border-secondary/20 p-1 text-[10px]" />
                           <textarea placeholder="Content/Story" value={hs.content} onChange={(e) => updateHotspot(zIndex, hsIndex, {content: e.target.value})} className="md:col-span-4 bg-dark border border-secondary/20 p-1 text-[10px]" />
                           
                           {hs.type === 'encounter' && (
                             <div className="md:col-span-4 space-y-2 mt-2">
                               <div className="flex justify-between items-center">
                                 <span className="text-[9px] uppercase font-bold text-primary-light">Choice Branches</span>
                                 <button onClick={() => addChoice(zIndex, hsIndex)} className="text-[9px] text-secondary hover:text-white">+ Add Choice</button>
                               </div>
                               {hs.choices?.map((c, cIndex) => (
                                 <div key={c.id} className="grid grid-cols-2 gap-2">
                                   <input placeholder="Explorer Action" value={c.text} onChange={(e) => {
                                      const newChoices = [...hs.choices!];
                                      newChoices[cIndex].text = e.target.value;
                                      updateHotspot(zIndex, hsIndex, {choices: newChoices});
                                   }} className="bg-dark border border-secondary/10 p-1 text-[9px]" />
                                   <input placeholder="Model Response" value={c.response} onChange={(e) => {
                                      const newChoices = [...hs.choices!];
                                      newChoices[cIndex].response = e.target.value;
                                      updateHotspot(zIndex, hsIndex, {choices: newChoices});
                                   }} className="bg-dark border border-secondary/10 p-1 text-[9px]" />
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addZone} className="w-full py-4 border-2 border-dashed border-secondary/30 text-secondary-light hover:border-primary/50 transition-all font-bold text-xs uppercase">Initialise New Sector</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetForm;
