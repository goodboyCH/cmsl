'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider'; // 1. Import
import { AIChatAssistant } from '@/components/AIChatAssistant';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

type SimulationType = 'grain_shrinkage' | 'dendrite_growth';

export function SimulationPage() {
  const { t } = useLanguage(); // 2. Hook 사용
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState(t('sim.status.ready')); // 초기값도 번역 적용 필요 (단, state라 초기 렌더링 시점에만 적용됨)
  const [errorText, setErrorText] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedSim, setSelectedSim] = useState<SimulationType>('grain_shrinkage');
  const wsRef = useRef<WebSocket | null>(null);

  const [gsParams, setGsParams] = useState({ 
    im: 100, 
    nnn_ed: 2000, 
    Nout: 50, 
    driv: 0.1,
    mobility: 1.0,      // 추가
    gb_energy: 1.0,     // 추가
    init_radius: 25.0,  // 추가
    noise_level: 0.0,   // 추가
    aniso_strength: 0.0,// 추가
    symmetry_mode: 4,
    nuclei_count: 1, 
    nucleation_mode: 'center'    // 추가
  });

  const [dgParams, setDgParams] = useState({ 
    n: 512, 
    steps: 3000, 
    n_fold_symmetry: 6, 
    aniso_magnitude: 0.12, 
    latent_heat_coef: 1.5,
    noise_level: 0.0,
    nuclei_count: 1, 
    nucleation_mode: 'center' // ✨ 추가
  });

  const handleAIUpdate = (type: string, params: any) => {
    if (type === 'grain_shrinkage' || type === 'dendrite_growth') {
      setSelectedSim(type as SimulationType);
    }
    if (type === 'grain_shrinkage') {
      setGsParams(prev => ({ ...prev, ...params }));
    } else if (type === 'dendrite_growth') {
      setDgParams(prev => ({ ...prev, ...params }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wsRef.current) { try { wsRef.current.close(); } catch (e) {} }
    if (!backendUrl) { setErrorText('Backend URL is not configured.'); return; }

    setIsRunning(true);
    setStatusText('Status: Validating parameters...');
    setErrorText(null);
    setResultImage(null);
    
    let body: { [key: string]: any };
    if (selectedSim === 'grain_shrinkage') {
      body = { simulation_type: 'grain_shrinkage', ...gsParams, jm: gsParams.im };
    } else {
      body = { simulation_type: 'dendrite_growth', ...dgParams };
    }

    const gridSize = body.im || body.n;
    const timeSteps = body.nnn_ed || body.steps;

    if (gridSize > 1024) {
      setErrorText("Grid Size cannot exceed 1024.");
      setIsRunning(false);
      return;
    }
    if (timeSteps > 5000) {
      setErrorText("Time Steps cannot exceed 5000.");
      setIsRunning(false);
      return;
    }

    try {
      setStatusText('Status: Sending request to backend...');
      const res = await fetch(`${backendUrl}/api/run-simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const data = await res.json();
      setStatusText(`Status: Task [${data.task_id}] is running...`);
      connectWebSocket(data.task_id);
    } catch (err: any) {
      setErrorText(err.message);
      setIsRunning(false);
    }
  };

  const connectWebSocket = (taskId: string) => {
    const wsUrl = backendUrl.replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsUrl}/api/ws/status/${taskId}`);
    wsRef.current = ws;
    ws.onopen = () => setStatusText('Status: Connected. Streaming results...');
    ws.onmessage = (event) => {
      const message = event.data;
      if (message === 'completed') {
        setStatusText('Status: Completed!');
        ws.close();
      } else if (message.startsWith('failed:')) {
        setErrorText(message);
        ws.close();
      } else {
        setResultImage(`data:image/png;base64,${message}`);
        setStatusText('Status: Receiving simulation frames...');
      }
    };
    ws.onerror = () => setErrorText('WebSocket connection error.');
    ws.onclose = () => setIsRunning(false);
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">{t('sim.header.title')}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{t('sim.header.desc')}</p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>{t('sim.control.title')}</CardTitle></CardHeader>
            <CardContent>
              {/* 3. form 태그 시작 바로 아래에 AI 컴포넌트 삽입 ⬇️ */}
              <AIChatAssistant onUpdateParams={handleAIUpdate} />
              
              <form onSubmit={handleSubmit}>
                <Tabs value={selectedSim} onValueChange={(value) => setSelectedSim(value as SimulationType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grain_shrinkage">{t('sim.tab.gs')}</TabsTrigger>
                    <TabsTrigger value="dendrite_growth">{t('sim.tab.dg')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grain_shrinkage" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">{t('sim.desc.gs')}</p>
                    
                    {/* 기존 파라미터 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label htmlFor="gs_im">Grid Size (im)</Label><Input id="gs_im" type="number" value={gsParams.im} max="512" onChange={e => setGsParams({...gsParams, im: parseInt(e.target.value) || 0})} /></div>
                      <div><Label htmlFor="gs_steps">Steps</Label><Input id="gs_steps" type="number" value={gsParams.nnn_ed} max="5000" onChange={e => setGsParams({...gsParams, nnn_ed: parseInt(e.target.value) || 0})}/></div>
                    </div>
                    
                    {/* ✨ 새로 추가된 고급 파라미터 UI */}
                    <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-900 space-y-3">
                      <p className="text-xs font-semibold text-slate-500">Advanced Physics</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-xs">Mobility</Label><Input type="number" step="0.1" value={gsParams.mobility} onChange={e => setGsParams({...gsParams, mobility: parseFloat(e.target.value)||0})}/></div>
                        <div><Label className="text-xs">Interface Energy</Label><Input type="number" step="0.1" value={gsParams.gb_energy} onChange={e => setGsParams({...gsParams, gb_energy: parseFloat(e.target.value)||0})}/></div>
                        <div><Label className="text-xs">Init Radius</Label><Input type="number" value={gsParams.init_radius} onChange={e => setGsParams({...gsParams, init_radius: parseFloat(e.target.value)||0})}/></div>
                        <div><Label className="text-xs">Noise Level</Label><Input type="number" step="0.01" value={gsParams.noise_level} onChange={e => setGsParams({...gsParams, noise_level: parseFloat(e.target.value)||0})}/></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div><Label className="text-xs">Aniso Strength (0-0.5)</Label><Input type="number" step="0.05" max="0.5" value={gsParams.aniso_strength} onChange={e => setGsParams({...gsParams, aniso_strength: parseFloat(e.target.value)||0})}/></div>
                        <div>
                          <Label className="text-xs">Symmetry Mode</Label>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={gsParams.symmetry_mode}
                            onChange={e => setGsParams({...gsParams, symmetry_mode: parseInt(e.target.value)})}
                          >
                            <option value={4}>4-Fold (Square)</option>
                            <option value={6}>6-Fold (Hexagon)</option>
                      
                          </select>
                        </div>
                      </div>
                    </div>

                    <div><Label htmlFor="gs_driv">Driving Force</Label><Input id="gs_driv" type="number" step="0.01" value={gsParams.driv} onChange={e => setGsParams({...gsParams, driv: parseFloat(e.target.value) || 0})}/></div>
                    <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-900/10 space-y-3">
                        <p className="text-xs font-semibold text-yellow-600">Nucleation Control</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Count</Label>
                                <Input type="number" min="1" max="20" value={gsParams.nuclei_count} onChange={e => setGsParams({...gsParams, nuclei_count: parseInt(e.target.value)||1})}/>
                            </div>
                            <div>
                                <Label className="text-xs">Position</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={gsParams.nucleation_mode}
                                    onChange={e => setGsParams({...gsParams, nucleation_mode: e.target.value})}
                                >
                                    <option value="center">Center (Single)</option>
                                    <option value="random">Random</option>
                                    <option value="circular">Circular Ring</option>
                                    <option value="bottom">Bottom Line</option>
                                </select>
                            </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="dendrite_growth" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">{t('sim.desc.dg')}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="dg_n">Grid Size (n)</Label><Input id="dg_n" type="number" value={dgParams.n} max="512" onChange={e => setDgParams({...dgParams, n: parseInt(e.target.value) || 0})} /></div>
                        <div><Label htmlFor="dg_steps">Steps</Label><Input id="dg_steps" type="number" value={dgParams.steps} max="5000" onChange={e => setDgParams({...dgParams, steps: parseInt(e.target.value) || 0})}/></div>
                    </div>

                    <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-900 space-y-3">
                        <p className="text-xs font-semibold text-slate-500">Physics Parameters</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="text-xs">Symmetry (4 or 6)</Label><Input type="number" value={dgParams.n_fold_symmetry} onChange={e => setDgParams({...dgParams, n_fold_symmetry: parseInt(e.target.value) || 0})}/></div>
                            <div><Label className="text-xs">Anisotropy (0.1~0.4)</Label><Input type="number" step="0.01" value={dgParams.aniso_magnitude} onChange={e => setDgParams({...dgParams, aniso_magnitude: parseFloat(e.target.value) || 0})}/></div>
                            <div><Label className="text-xs">Latent Heat (0.8~2.0)</Label><Input type="number" step="0.1" value={dgParams.latent_heat_coef} onChange={e => setDgParams({...dgParams, latent_heat_coef: parseFloat(e.target.value) || 0})}/></div>
                            {/* ✨ 노이즈 입력 추가 */}
                            <div>
                                <Label className="text-xs text-blue-600 font-bold">Noise Level (Realism)</Label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    max="0.2"
                                    value={dgParams.noise_level} 
                                    onChange={e => setDgParams({...dgParams, noise_level: parseFloat(e.target.value) || 0})}
                                    className="border-blue-200 focus-visible:ring-blue-400"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">Rec: 0.0 (Smooth) ~ 0.05 (Rough)</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-900/10 space-y-3">
                        <p className="text-xs font-semibold text-yellow-600">Nucleation Control</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Count</Label>
                                <Input type="number" min="1" max="10" value={dgParams.nuclei_count} onChange={e => setDgParams({...dgParams, nuclei_count: parseInt(e.target.value)||1})}/>
                            </div>
                            <div>
                                <Label className="text-xs">Position</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={dgParams.nucleation_mode}
                                    onChange={e => setDgParams({...dgParams, nucleation_mode: e.target.value})}
                                >
                                    <option value="center">Center (Single)</option>
                                    <option value="random">Random</option>
                                    <option value="bottom">Bottom Line</option>
                                </select>
                            </div>
                        </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button type="submit" className="w-full mt-6" disabled={isRunning}>
                  {isRunning ? t('sim.btn.running') : t('sim.btn.start')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>{t('sim.result.title')}</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center border">
                {resultImage ? (
                  <img src={resultImage} alt="Simulation result" className="max-w-full max-h-full" />
                ) : (
                  <span className="text-muted-foreground">{t('sim.result.placeholder')}</span>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground text-center">{statusText}</div>
                {errorText && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorText}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}