import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider'; // 1. Import

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type SimulationType = 'grain_shrinkage' | 'dendrite_growth';

export function SimulationPage() {
  const { t } = useLanguage(); // 2. Hook 사용
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState(t('sim.status.ready')); // 초기값도 번역 적용 필요 (단, state라 초기 렌더링 시점에만 적용됨)
  const [errorText, setErrorText] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedSim, setSelectedSim] = useState<SimulationType>('grain_shrinkage');
  const wsRef = useRef<WebSocket | null>(null);

  const [gsParams, setGsParams] = useState({ im: 100, nnn_ed: 2000, Nout: 100, driv: 0.1 });
  const [dgParams, setDgParams] = useState({ n: 512, steps: 3000, n_fold_symmetry: 4, aniso_magnitude: 0.12, latent_heat_coef: 1.5 });

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
              <form onSubmit={handleSubmit}>
                <Tabs value={selectedSim} onValueChange={(value) => setSelectedSim(value as SimulationType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grain_shrinkage">{t('sim.tab.gs')}</TabsTrigger>
                    <TabsTrigger value="dendrite_growth">{t('sim.tab.dg')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grain_shrinkage" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">{t('sim.desc.gs')}</p>
                    <div><Label htmlFor="gs_im">{t('sim.label.grid')} (im/jm)</Label><Input id="gs_im" type="number" value={gsParams.im} max="1024" onChange={e => setGsParams({...gsParams, im: parseInt(e.target.value) || 0})} /></div>
                    <div><Label htmlFor="gs_nnn_ed">{t('sim.label.steps')} (nnn_ed)</Label><Input id="gs_nnn_ed" type="number" value={gsParams.nnn_ed} max="5000" onChange={e => setGsParams({...gsParams, nnn_ed: parseInt(e.target.value) || 0})}/></div>
                    <div><Label htmlFor="gs_Nout">{t('sim.label.interval')} (Nout)</Label><Input id="gs_Nout" type="number" value={gsParams.Nout} onChange={e => setGsParams({...gsParams, Nout: parseInt(e.target.value) || 0})}/></div>
                    <div><Label htmlFor="gs_driv">{t('sim.label.drive')} (driv)</Label><Input id="gs_driv" type="number" step="0.01" value={gsParams.driv} onChange={e => setGsParams({...gsParams, driv: parseFloat(e.target.value) || 0})}/></div>
                  </TabsContent>

                  <TabsContent value="dendrite_growth" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">{t('sim.desc.dg')}</p>
                    <div><Label htmlFor="dg_n">{t('sim.label.grid')} (n x n)</Label><Input id="dg_n" type="number" value={dgParams.n} max="1024" onChange={e => setDgParams({...dgParams, n: parseInt(e.target.value) || 0})} /></div>
                    <div><Label htmlFor="dg_steps">{t('sim.label.steps')}</Label><Input id="dg_steps" type="number" value={dgParams.steps} max="5000" onChange={e => setDgParams({...dgParams, steps: parseInt(e.target.value) || 0})}/></div>
                    <div><Label htmlFor="dg_n_fold">{t('sim.label.symmetry')}</Label><Input id="dg_n_fold" type="number" value={dgParams.n_fold_symmetry} onChange={e => setDgParams({...dgParams, n_fold_symmetry: parseInt(e.target.value) || 0})}/></div>
                    <div><Label htmlFor="dg_aniso">{t('sim.label.aniso')}</Label><Input id="dg_aniso" type="number" step="0.01" value={dgParams.aniso_magnitude} onChange={e => setDgParams({...dgParams, aniso_magnitude: parseFloat(e.target.value) || 0})}/></div>
                    <div><Label htmlFor="dg_latent_heat">{t('sim.label.latent')}</Label><Input id="dg_latent_heat" type="number" step="0.1" value={dgParams.latent_heat_coef} onChange={e => setDgParams({...dgParams, latent_heat_coef: parseFloat(e.target.value) || 0})}/></div>
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