
import React, { useState } from 'react';
import { Stage, Zone, Hotspot, EncounterChoice } from '../types';

interface PlanetFormProps {
  stage: Stage;
  onSave: (stage: Stage) => void;
  onCancel: () => void;
}

const PlanetForm: React.FC<PlanetFormProps> = ({ stage: initialStage, onSave, onCancel }) => {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [activeTab, setActiveTab] = useState<'base' | 'meta' | 'zones'>('base');

  const updateMeta = (key: string, value: any) => {
    setStage(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const addZone = () => {
    const newZone: Zone = {
      id: `zone_${Date.now()}`,
      name: '새로운 탐사 구역',
      imageUrl: '',
      hotspots: []
    };
    setStage(prev => ({ ...prev, zones: [...prev.zones, newZone] }));
  };

  const removeZone = (idx: number) => {
    const next = [...stage.zones];
    next.splice(idx, 1);
    setStage({...stage, zones: next});
  };

  const addHotspot = (zoneIdx: number) => {
    const newHS: Hotspot = {
      id: `hs_${Math.random().toString(36).substr(2, 9)}`,
      x: 50, y: 50, label: '정보 지점', type: 'info', content: ''
    };
    const nextZones = [...stage.zones];
    nextZones[zoneIdx].hotspots.push(newHS);
    setStage(prev => ({ ...prev, zones: nextZones }));
  };

  const removeHotspot = (zoneIdx: number, hsIdx: number) => {
    const nextZones = [...stage.zones];
    nextZones[zoneIdx].hotspots.splice(hsIdx, 1);
    setStage(prev => ({ ...prev, zones: nextZones }));
  };

  const addChoice = (zoneIdx: number, hsIdx: number) => {
    const newChoice: EncounterChoice = { id: `choice_${Date.now()}`, text: '', response: '' };
    const nextZones = [...stage.zones];
    const hs = nextZones[zoneIdx].hotspots[hsIdx];
    if (!hs.choices) hs.choices = [];
    hs.choices.push(newChoice);
    setStage(prev => ({ ...prev, zones: nextZones }));
  };

  const removeChoice = (zoneIdx: number, hsIdx: number, choiceIdx: number) => {
    const nextZones = [...stage.zones];
    const hs = nextZones[zoneIdx].hotspots[hsIdx];
    if (hs.choices) {
      hs.choices.splice(choiceIdx, 1);
      setStage(prev => ({ ...prev, zones: nextZones }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-dark/95 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-primary/30 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">
        <div className="p-6 border-b border-secondary/10 flex justify-between items-center glass">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <h2 className="orbitron text-xl font-bold text-white tracking-widest">PLANETARY ARCHITECT MODULE</h2>
          </div>
          <div className="flex space-x-3">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-light-dim uppercase hover:text-white transition-colors">닫기</button>
            <button onClick={() => onSave(stage)} className="px-8 py-2 bg-primary text-white text-xs font-bold rounded-lg orbitron hover:bg-primary-dark transition-all active-glow">변경 사항 영구 저장</button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="flex space-x-8 border-b border-secondary/10">
            <button onClick={() => setActiveTab('base')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'base' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>기본 정보</button>
            <button onClick={() => setActiveTab('meta')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'meta' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>행성 제원 설정</button>
            <button onClick={() => setActiveTab('zones')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'zones' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>구역 및 이벤트 ({stage.zones.length})</button>
          </div>

          {activeTab === 'base' && (
            <div className="grid grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">행성 공식 명칭</span>
                  <input value={stage.name} onChange={e => setStage({...stage, name: e.target.value})} className="w-full bg-dark border border-secondary/20 p-4 mt-2 rounded-lg text-white focus:border-primary outline-none transition-all" placeholder="예: Aethelgard Prime" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">데이터 식별 코드</span>
                  <input value={stage.code} onChange={e => setStage({...stage, code: e.target.value})} className="w-full bg-dark border border-secondary/20 p-4 mt-2 rounded-lg text-white font-mono focus:border-primary outline-none transition-all" placeholder="예: AE-001" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">탐사 개요 및 브리핑</span>
                <textarea value={stage.overview} onChange={e => setStage({...stage, overview: e.target.value})} className="w-full h-44 bg-dark border border-secondary/20 p-4 mt-2 rounded-lg text-white resize-none focus:border-primary outline-none transition-all" placeholder="행성에 대한 전반적인 설명을 입력하세요..." />
              </label>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="grid grid-cols-3 gap-6 animate-fade-in">
              {Object.keys(stage.metadata).map(key => {
                if (key === 'atmosphere') return null;
                const labels: any = { formationTime: '형성 시기', orbit: '궤도', satellites: '위성 수', gravity: '중력', diameter: '지름', landSeaRatio: '토양/바다 비율', geology: '지질 구성', internalStructure: '내부 구조', rotationPeriod: '자전 주기', revolutionPeriod: '공전 주기', circulationSystem: '순환 시스템' };
                return (
                  <label key={key} className="block">
                    <span className="text-[10px] text-secondary-light uppercase font-bold tracking-tighter">{labels[key] || key}</span>
                    <input value={(stage.metadata as any)[key]} onChange={e => updateMeta(key, e.target.value)} className="w-full bg-dark border border-secondary/20 p-3 mt-1 rounded text-xs text-light focus:border-primary outline-none transition-all" />
                  </label>
                )
              })}
              <div className="col-span-3 border-t border-secondary/10 pt-6 grid grid-cols-2 gap-6">
                 <label className="block">
                    <span className="text-[10px] text-primary font-bold uppercase">대기 중 산소 농도 (%)</span>
                    <input type="number" value={stage.metadata.atmosphere.o2} onChange={e => setStage({...stage, metadata: {...stage.metadata, atmosphere: {...stage.metadata.atmosphere, o2: parseInt(e.target.value)}}})} className="w-full bg-dark border border-primary/20 p-3 mt-1 rounded text-white" />
                 </label>
                 <label className="block">
                    <span className="text-[10px] text-secondary font-bold uppercase">대기 중 질소 농도 (%)</span>
                    <input type="number" value={stage.metadata.atmosphere.n2} onChange={e => setStage({...stage, metadata: {...stage.metadata, atmosphere: {...stage.metadata.atmosphere, n2: parseInt(e.target.value)}}})} className="w-full bg-dark border-secondary/20 p-3 mt-1 rounded text-white" />
                 </label>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-12 animate-fade-in pb-10">
              {stage.zones.map((zone, zIdx) => (
                <div key={zone.id} className="p-8 border border-secondary/20 bg-dark/50 rounded-2xl relative group shadow-inner">
                  <button onClick={() => removeZone(zIdx)} className="absolute top-4 right-4 text-[10px] text-red-500 hover:text-white font-bold uppercase underline opacity-0 group-hover:opacity-100 transition-all">구역 영구 제거</button>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <label className="block">
                      <span className="text-[9px] font-bold text-secondary-light uppercase">구역 명칭</span>
                      <input value={zone.name} onChange={e => {
                        const next = [...stage.zones];
                        next[zIdx].name = e.target.value;
                        setStage({...stage, zones: next});
                      }} className="w-full bg-dark border border-secondary/20 p-3 rounded-lg text-sm font-bold text-white mt-1" />
                    </label>
                    <label className="block">
                      <span className="text-[9px] font-bold text-secondary-light uppercase">배경 이미지 URL (HD 권장)</span>
                      <input value={zone.imageUrl} onChange={e => {
                        const next = [...stage.zones];
                        next[zIdx].imageUrl = e.target.value;
                        setStage({...stage, zones: next});
                      }} className="w-full bg-dark border border-secondary/20 p-3 rounded-lg text-xs text-light-dim mt-1" />
                    </label>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-secondary/10 pb-2">
                      <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Hotspots</h4>
                      <button onClick={() => addHotspot(zIdx)} className="text-[10px] bg-secondary/10 px-4 py-1.5 hover:bg-secondary text-white rounded-full transition-all">+ 포인트 추가</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {zone.hotspots.map((hs, hsIdx) => (
                        <div key={hs.id} className="p-6 border border-secondary/10 bg-black/40 rounded-xl space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-4 gap-4 flex-grow mr-4">
                              <input value={hs.label} onChange={e => {
                                const next = [...stage.zones];
                                next[zIdx].hotspots[hsIdx].label = e.target.value;
                                setStage({...stage, zones: next});
                              }} className="bg-dark border border-secondary/10 p-2 text-xs text-white" placeholder="포인트 명칭" />
                              <select value={hs.type} onChange={e => {
                                const next = [...stage.zones];
                                next[zIdx].hotspots[hsIdx].type = e.target.value as any;
                                setStage({...stage, zones: next});
                              }} className="bg-dark border border-secondary/10 p-2 text-xs text-white">
                                <option value="info">단순 정보</option>
                                <option value="encounter">미지의 존재 조우</option>
                              </select>
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] text-light-dim">X:</span>
                                <input type="number" value={hs.x} onChange={e => {
                                  const next = [...stage.zones];
                                  next[zIdx].hotspots[hsIdx].x = parseInt(e.target.value);
                                  setStage({...stage, zones: next});
                                }} className="bg-dark border border-secondary/10 p-2 text-xs w-full text-white" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] text-light-dim">Y:</span>
                                <input type="number" value={hs.y} onChange={e => {
                                  const next = [...stage.zones];
                                  next[zIdx].hotspots[hsIdx].y = parseInt(e.target.value);
                                  setStage({...stage, zones: next});
                                }} className="bg-dark border border-secondary/10 p-2 text-xs w-full text-white" />
                              </div>
                            </div>
                            <button onClick={() => removeHotspot(zIdx, hsIdx)} className="text-red-500 hover:text-white p-2">×</button>
                          </div>
                          
                          <textarea value={hs.content} onChange={e => {
                            const next = [...stage.zones];
                            next[zIdx].hotspots[hsIdx].content = e.target.value;
                            setStage({...stage, zones: next});
                          }} className="w-full bg-dark border border-secondary/10 p-3 text-xs h-24 text-light-muted resize-none" placeholder="포인트 클릭 시 나타날 내용 또는 조우 대사를 입력하세요..." />

                          {hs.type === 'encounter' && (
                            <div className="pl-6 border-l-2 border-primary/30 space-y-4 py-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-primary-light uppercase tracking-widest">분기 선택지 설정</span>
                                <button onClick={() => addChoice(zIdx, hsIdx)} className="text-[9px] text-secondary hover:text-white bg-secondary/10 px-3 py-1 rounded-full">+ 선택지 추가</button>
                              </div>
                              <div className="space-y-3">
                                {hs.choices?.map((choice, cIdx) => (
                                  <div key={choice.id} className="flex space-x-3 items-center group/choice">
                                    <div className="flex-grow grid grid-cols-2 gap-3">
                                      <input value={choice.text} onChange={e => {
                                        const next = [...stage.zones];
                                        next[zIdx].hotspots[hsIdx].choices![cIdx].text = e.target.value;
                                        setStage({...stage, zones: next});
                                      }} className="bg-dark border border-secondary/10 p-2 text-[10px] text-white" placeholder="사용자 선택 문구" />
                                      <input value={choice.response} onChange={e => {
                                        const next = [...stage.zones];
                                        next[zIdx].hotspots[hsIdx].choices![cIdx].response = e.target.value;
                                        setStage({...stage, zones: next});
                                      }} className="bg-dark border border-secondary/10 p-2 text-[10px] text-primary-light" placeholder="그에 따른 결과 반응" />
                                    </div>
                                    <button 
                                      onClick={() => removeChoice(zIdx, hsIdx, cIdx)} 
                                      className="text-red-500/50 hover:text-red-500 p-1 text-xs"
                                      title="선택지 삭제"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                ))}
                                {(!hs.choices || hs.choices.length === 0) && (
                                  <p className="text-[9px] text-secondary-muted italic">설정된 선택지가 없습니다.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addZone} className="w-full py-10 border-2 border-dashed border-secondary/20 text-secondary hover:border-primary hover:text-primary transition-all font-bold text-sm tracking-[0.3em] bg-dark/20 rounded-2xl uppercase">
                + Deploy New Exploration Zone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetForm;
