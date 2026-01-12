
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
      id: Date.now().toString(),
      name: '새로운 구역',
      imageUrl: '',
      hotspots: []
    };
    setStage(prev => ({ ...prev, zones: [...prev.zones, newZone] }));
  };

  const addHotspot = (zoneIdx: number) => {
    const newHS: Hotspot = {
      id: Math.random().toString(36).substr(2, 9),
      x: 50, y: 50, label: '정보 지점', type: 'info', content: ''
    };
    const nextZones = [...stage.zones];
    nextZones[zoneIdx].hotspots.push(newHS);
    setStage(prev => ({ ...prev, zones: nextZones }));
  };

  const addChoice = (zoneIdx: number, hsIdx: number) => {
    const newChoice: EncounterChoice = { id: Date.now().toString(), text: '', response: '' };
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
      <div className="bg-dark-card border border-primary/30 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col">
        <div className="p-6 border-b border-dark flex justify-between items-center glass">
          <h2 className="orbitron text-xl font-bold text-primary">PLANETARY ARCHITECT</h2>
          <div className="flex space-x-3">
            <button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-light-dim uppercase hover:text-white transition-colors">닫기</button>
            <button onClick={() => onSave(stage)} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg orbitron hover:bg-primary-dark transition-all">데이터 커밋</button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10">
          <div className="flex space-x-8 border-b border-dark">
            <button onClick={() => setActiveTab('base')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'base' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>기본 정보</button>
            <button onClick={() => setActiveTab('meta')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'meta' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>상세 제원</button>
            <button onClick={() => setActiveTab('zones')} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'zones' ? 'text-primary border-b-2 border-primary' : 'text-light-dim'}`}>탐사 구역 ({stage.zones.length})</button>
          </div>

          {activeTab === 'base' && (
            <div className="grid grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">행성 명칭</span>
                  <input value={stage.name} onChange={e => setStage({...stage, name: e.target.value})} className="w-full bg-dark border border-secondary/20 p-3 mt-2 rounded-lg" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">섹터 코드</span>
                  <input value={stage.code} onChange={e => setStage({...stage, code: e.target.value})} className="w-full bg-dark border border-secondary/20 p-3 mt-2 rounded-lg" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] font-bold text-secondary-light uppercase tracking-widest">임무 개요</span>
                <textarea value={stage.overview} onChange={e => setStage({...stage, overview: e.target.value})} className="w-full h-40 bg-dark border border-secondary/20 p-3 mt-2 rounded-lg resize-none" />
              </label>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="grid grid-cols-3 gap-6 animate-fade-in text-[11px]">
              {Object.keys(stage.metadata).map(key => {
                if (key === 'atmosphere') return null;
                return (
                  <label key={key} className="block">
                    <span className="text-secondary-light uppercase font-bold tracking-tighter">{key}</span>
                    <input value={(stage.metadata as any)[key]} onChange={e => updateMeta(key, e.target.value)} className="w-full bg-dark border border-secondary/20 p-2 mt-1 rounded" />
                  </label>
                )
              })}
              <div className="col-span-3 border-t border-dark pt-4 grid grid-cols-2 gap-4">
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold">대기 산소 농도 (%)</span>
                    <input type="number" value={stage.metadata.atmosphere.o2} onChange={e => setStage({...stage, metadata: {...stage.metadata, atmosphere: {...stage.metadata.atmosphere, o2: parseInt(e.target.value)}}})} className="w-full bg-dark border border-secondary/20 p-2 mt-1 rounded" />
                 </label>
                 <label className="block">
                    <span className="text-secondary-light uppercase font-bold">대기 질소 농도 (%)</span>
                    <input type="number" value={stage.metadata.atmosphere.n2} onChange={e => setStage({...stage, metadata: {...stage.metadata, atmosphere: {...stage.metadata.atmosphere, n2: parseInt(e.target.value)}}})} className="w-full bg-dark border border-secondary/20 p-2 mt-1 rounded" />
                 </label>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-12 animate-fade-in pb-10">
              {stage.zones.map((zone, zIdx) => (
                <div key={zone.id} className="p-6 border border-secondary/10 bg-dark/30 rounded-2xl relative">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <input value={zone.name} onChange={e => {
                      const next = [...stage.zones];
                      next[zIdx].name = e.target.value;
                      setStage({...stage, zones: next});
                    }} className="bg-dark border border-secondary/20 p-3 rounded-lg text-sm font-bold" placeholder="구역 이름" />
                    <input value={zone.imageUrl} onChange={e => {
                      const next = [...stage.zones];
                      next[zIdx].imageUrl = e.target.value;
                      setStage({...stage, zones: next});
                    }} className="bg-dark border border-secondary/20 p-3 rounded-lg text-sm" placeholder="배경 이미지 URL" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest">상호작용 지점</h4>
                      <button onClick={() => addHotspot(zIdx)} className="text-[10px] bg-secondary/20 px-3 py-1 hover:bg-secondary text-white rounded transition-all">+ 지점 추가</button>
                    </div>
                    {zone.hotspots.map((hs, hsIdx) => (
                      <div key={hs.id} className="p-4 border border-secondary/10 bg-black/20 rounded-xl space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <input value={hs.label} onChange={e => {
                            const next = [...stage.zones];
                            next[zIdx].hotspots[hsIdx].label = e.target.value;
                            setStage({...stage, zones: next});
                          }} className="bg-dark border border-secondary/10 p-2 text-xs" placeholder="라벨" />
                          <select value={hs.type} onChange={e => {
                            const next = [...stage.zones];
                            next[zIdx].hotspots[hsIdx].type = e.target.value as any;
                            setStage({...stage, zones: next});
                          }} className="bg-dark border border-secondary/10 p-2 text-xs">
                            <option value="info">정보</option>
                            <option value="encounter">조우</option>
                          </select>
                          <input type="number" value={hs.x} onChange={e => {
                            const next = [...stage.zones];
                            next[zIdx].hotspots[hsIdx].x = parseInt(e.target.value);
                            setStage({...stage, zones: next});
                          }} className="bg-dark border border-secondary/10 p-2 text-xs" placeholder="X (%)" />
                          <input type="number" value={hs.y} onChange={e => {
                            const next = [...stage.zones];
                            next[zIdx].hotspots[hsIdx].y = parseInt(e.target.value);
                            setStage({...stage, zones: next});
                          }} className="bg-dark border border-secondary/10 p-2 text-xs" placeholder="Y (%)" />
                        </div>
                        <textarea value={hs.content} onChange={e => {
                          const next = [...stage.zones];
                          next[zIdx].hotspots[hsIdx].content = e.target.value;
                          setStage({...stage, zones: next});
                        }} className="w-full bg-dark border border-secondary/10 p-2 text-xs h-20" placeholder="내용 또는 이야기" />

                        {hs.type === 'encounter' && (
                          <div className="pl-6 border-l border-primary/20 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-primary tracking-widest">선택지 분기</span>
                              <button onClick={() => addChoice(zIdx, hsIdx)} className="text-[9px] text-secondary hover:text-white underline">+ 추가</button>
                            </div>
                            {hs.choices?.map((choice, cIdx) => (
                              <div key={choice.id} className="flex space-x-2 items-start">
                                <div className="flex-grow grid grid-cols-2 gap-2">
                                  <input value={choice.text} onChange={e => {
                                    const next = [...stage.zones];
                                    next[zIdx].hotspots[hsIdx].choices![cIdx].text = e.target.value;
                                    setStage({...stage, zones: next});
                                  }} className="bg-dark border border-secondary/10 p-2 text-[10px]" placeholder="선택지 텍스트" />
                                  <input value={choice.response} onChange={e => {
                                    const next = [...stage.zones];
                                    next[zIdx].hotspots[hsIdx].choices![cIdx].response = e.target.value;
                                    setStage({...stage, zones: next});
                                  }} className="bg-dark border border-secondary/10 p-2 text-[10px]" placeholder="결과 반응" />
                                </div>
                                <button onClick={() => removeChoice(zIdx, hsIdx, cIdx)} className="text-[9px] text-primary p-2">삭제</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {
                    const next = [...stage.zones];
                    next.splice(zIdx, 1);
                    setStage({...stage, zones: next});
                  }} className="mt-4 text-[10px] text-primary font-bold underline">구역 전체 삭제</button>
                </div>
              ))}
              <button onClick={addZone} className="w-full py-8 border-2 border-dashed border-secondary/20 text-secondary hover:border-primary transition-all font-bold text-xs">+ 새로운 탐사 구역 초기화</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetForm;
