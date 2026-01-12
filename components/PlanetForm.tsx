
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
      name: `신규 구역 ${stage.zones.length + 1}`,
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
      label: '새 상호작용 지점',
      type: 'info',
      content: ''
    };
    const newZones = [...stage.zones];
    newZones[zoneIndex].hotspots.push(newHotspot);
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  const removeHotspot = (zoneIndex: number, hsIndex: number) => {
    const newZones = [...stage.zones];
    newZones[zoneIndex].hotspots = newZones[zoneIndex].hotspots.filter((_, i) => i !== hsIndex);
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

  const removeChoice = (zoneIndex: number, hsIndex: number, choiceIndex: number) => {
    const newZones = [...stage.zones];
    const hs = newZones[zoneIndex].hotspots[hsIndex];
    if (hs.choices) {
      hs.choices = hs.choices.filter((_, i) => i !== choiceIndex);
    }
    setStage(prev => ({ ...prev, zones: newZones }));
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4">
      <div className="bg-dark-card border-2 border-primary/50 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-scale-in">
        <div className="sticky top-0 glass border-b border-primary/30 p-4 flex justify-between items-center z-20">
          <h2 className="orbitron text-xl font-bold text-white uppercase tracking-widest">Planet Construction Module</h2>
          <div className="space-x-4">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-light-dim uppercase hover:text-white">취소</button>
            <button 
              onClick={() => onSave(stage)}
              className="px-6 py-2 bg-primary text-white text-xs font-bold rounded orbitron hover:bg-primary-dark transition-all"
            >
              기록 확정 (COMMIT)
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex space-x-6 mb-8 border-b border-dark">
            <button onClick={() => setActiveTab('info')} className={`pb-3 px-2 uppercase text-xs font-bold transition-all ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>기본 정보</button>
            <button onClick={() => setActiveTab('metadata')} className={`pb-3 px-2 uppercase text-xs font-bold transition-all ${activeTab === 'metadata' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>행성 제원</button>
            <button onClick={() => setActiveTab('zones')} className={`pb-3 px-2 uppercase text-xs font-bold transition-all ${activeTab === 'zones' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>탐사 구역 ({stage.zones.length})</button>
          </div>

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-xs font-bold text-secondary-light uppercase tracking-widest">행성 명칭</span>
                  <input type="text" name="name" value={stage.name} onChange={handleChange} className="w-full bg-dark border border-secondary/30 p-3 text-white rounded mt-2 focus:border-primary outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-secondary-light uppercase tracking-widest">섹터 코드</span>
                  <input type="text" name="code" value={stage.code} onChange={handleChange} className="w-full bg-dark border border-secondary/30 p-3 text-white rounded mt-2 focus:border-primary outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-bold text-secondary-light uppercase tracking-widest">임무 개요</span>
                <textarea name="overview" value={stage.overview} onChange={handleChange} className="w-full h-40 bg-dark border border-secondary/30 p-3 text-white rounded mt-2 focus:border-primary outline-none resize-none" />
              </label>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in text-xs">
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">형성 시기</span>
                <input name="formationTime" value={stage.metadata.formationTime} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">궤도 특성</span>
                <input name="orbit" value={stage.metadata.orbit} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">위성 수</span>
                <input type="number" name="satellites" value={stage.metadata.satellites} onChange={(e) => setStage(prev => ({...prev, metadata: {...prev.metadata, satellites: parseInt(e.target.value) || 0}}))} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">중력 수준</span>
                <input name="gravity" value={stage.metadata.gravity} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">지름</span>
                <input name="diameter" value={stage.metadata.diameter} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">토양/바다 비율</span>
                <input name="landSeaRatio" value={stage.metadata.landSeaRatio} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">대기 산소 농도 (%)</span>
                <input type="number" value={stage.metadata.atmosphere.o2} onChange={(e) => handleAtmosphereChange('o2', e.target.value)} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">대기 질소 농도 (%)</span>
                <input type="number" value={stage.metadata.atmosphere.n2} onChange={(e) => handleAtmosphereChange('n2', e.target.value)} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <label className="block">
                <span className="text-secondary-light uppercase font-bold tracking-widest">자전 주기</span>
                <input name="rotationPeriod" value={stage.metadata.rotationPeriod} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
              </label>
              <div className="md:col-span-3 space-y-6 pt-4 border-t border-dark">
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold tracking-widest">지질의 구성</span>
                    <input name="geology" value={stage.metadata.geology} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
                 </label>
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold tracking-widest">행성의 내부 구조</span>
                    <input name="internalStructure" value={stage.metadata.internalStructure} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
                 </label>
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold tracking-widest">행성 순환 시스템</span>
                    <input name="circulationSystem" value={stage.metadata.circulationSystem} onChange={handleMetadataChange} className="w-full bg-dark border border-secondary/30 p-3 mt-2 rounded focus:border-primary outline-none" />
                 </label>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-10 animate-fade-in pb-10">
              {stage.zones.map((zone, zIndex) => (
                <div key={zone.id} className="p-6 border border-secondary/20 rounded-lg bg-dark relative shadow-inner">
                  <button onClick={() => removeZone(zIndex)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-white font-bold uppercase underline">구역 제거</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold text-primary-light tracking-widest">구역 명칭</span>
                      <input value={zone.name} onChange={(e) => updateZone(zIndex, 'name', e.target.value)} className="w-full bg-dark-card border border-secondary/30 p-3 text-white text-xs rounded mt-2 focus:border-primary outline-none" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold text-primary-light tracking-widest">배경 이미지 URL (가로 사이즈 권장)</span>
                      <input value={zone.imageUrl} onChange={(e) => updateZone(zIndex, 'imageUrl', e.target.value)} className="w-full bg-dark-card border border-secondary/30 p-3 text-white text-xs rounded mt-2 focus:border-primary outline-none" />
                    </label>
                  </div>
                  
                  <div className="mt-6 border-t border-dark pt-6">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-[10px] uppercase font-bold text-secondary-light tracking-widest">포인트 앤 클릭 상호작용 지점</h4>
                       <button onClick={() => addHotspot(zIndex)} className="text-[10px] bg-secondary/20 px-4 py-2 hover:bg-secondary text-white rounded font-bold transition-all">+ 상호작용 추가</button>
                    </div>
                    <div className="space-y-6">
                      {zone.hotspots.map((hs, hsIndex) => (
                        <div key={hs.id} className="p-4 bg-dark-card/50 border border-secondary/10 rounded">
                           <div className="flex justify-between mb-4">
                              <span className="text-[10px] text-primary-light font-bold"># {hsIndex + 1}</span>
                              <button onClick={() => removeHotspot(zIndex, hsIndex)} className="text-[9px] text-red-500/50 hover:text-red-500">지점 삭제</button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] text-light-dim uppercase font-bold">라벨</span>
                                <input placeholder="명칭" value={hs.label} onChange={(e) => updateHotspot(zIndex, hsIndex, {label: e.target.value})} className="w-full bg-dark border border-secondary/20 p-2 text-[10px] text-white" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-light-dim uppercase font-bold">유형</span>
                                <select value={hs.type} onChange={(e) => updateHotspot(zIndex, hsIndex, {type: e.target.value as any})} className="w-full bg-dark border border-secondary/20 p-2 text-[10px] text-white">
                                   <option value="info">단순 정보 (INFO)</option>
                                   <option value="encounter">조우 이벤트 (ENCOUNTER)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-light-dim uppercase font-bold">X 좌표 (%)</span>
                                <input type="number" placeholder="0-100" value={hs.x} onChange={(e) => updateHotspot(zIndex, hsIndex, {x: parseInt(e.target.value) || 0})} className="w-full bg-dark border border-secondary/20 p-2 text-[10px] text-white" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-light-dim uppercase font-bold">Y 좌표 (%)</span>
                                <input type="number" placeholder="0-100" value={hs.y} onChange={(e) => updateHotspot(zIndex, hsIndex, {y: parseInt(e.target.value) || 0})} className="w-full bg-dark border border-secondary/20 p-2 text-[10px] text-white" />
                              </div>
                              <div className="md:col-span-4 space-y-1">
                                <span className="text-[9px] text-light-dim uppercase font-bold">내용 / 이야기</span>
                                <textarea placeholder="조우 시 대사 또는 설명 문구" value={hs.content} onChange={(e) => updateHotspot(zIndex, hsIndex, {content: e.target.value})} className="w-full bg-dark border border-secondary/20 p-2 text-[10px] text-white h-20 resize-none" />
                              </div>
                              
                              {hs.type === 'encounter' && (
                                <div className="md:col-span-4 space-y-3 mt-2 bg-black/30 p-4 rounded border border-primary/10">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] uppercase font-bold text-primary-light tracking-widest">선택지 및 분기 설정</span>
                                    <button onClick={() => addChoice(zIndex, hsIndex)} className="text-[9px] text-secondary hover:text-white font-bold">+ 선택지 추가</button>
                                  </div>
                                  {hs.choices?.map((c, cIndex) => (
                                    <div key={c.id} className="flex items-start space-x-2">
                                      <div className="flex-grow grid grid-cols-2 gap-2">
                                        <input placeholder="탐사원 선택 대사" value={c.text} onChange={(e) => {
                                           const newChoices = [...hs.choices!];
                                           newChoices[cIndex].text = e.target.value;
                                           updateHotspot(zIndex, hsIndex, {choices: newChoices});
                                        }} className="bg-dark border border-secondary/10 p-2 text-[10px] text-white" />
                                        <input placeholder="시스템/상대 반응" value={c.response} onChange={(e) => {
                                           const newChoices = [...hs.choices!];
                                           newChoices[cIndex].response = e.target.value;
                                           updateHotspot(zIndex, hsIndex, {choices: newChoices});
                                        }} className="bg-dark border border-secondary/10 p-2 text-[10px] text-white" />
                                      </div>
                                      <button 
                                        onClick={() => removeChoice(zIndex, hsIndex, cIndex)}
                                        className="p-2 text-red-500 hover:text-white text-[10px] font-bold"
                                        title="선택지 삭제"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  ))}
                                  {(!hs.choices || hs.choices.length === 0) && (
                                    <p className="text-[9px] text-light-dim italic">선택지가 없습니다. 탐사원은 반응 없이 다음으로 넘어갑니다.</p>
                                  )}
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addZone} className="w-full py-8 border-2 border-dashed border-secondary/30 text-secondary-light hover:border-primary/50 transition-all font-bold text-sm uppercase tracking-widest">+ 새로운 탐사 구역 추가</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetForm;
