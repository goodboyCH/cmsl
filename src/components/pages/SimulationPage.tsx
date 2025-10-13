// src/components/pages/SimulationPage.tsx

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Status: Ready.');
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [paramsInUse, setParamsInUse] = useState<object | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) { console.error('Error closing WebSocket:', e); }
    }

    setIsRunning(true);
    setStatusText('Status: Initializing...');
    setErrorText(null);
    setProgress(0);
    setParamsInUse(null);
    setResultImage(null);

    const formData = new FormData(event.currentTarget);
    const formProps = Object.fromEntries(formData);
    
    const pick = (key: string) => {
      const value = formProps[key];
      if (typeof value !== 'string' || value === '') return null;
      const num = Number(value);
      return Number.isFinite(num) ? num : null;
    };

    const body = {
      grid_size: pick('grid_size') ?? 256,
      time_steps: pick('time_steps') ?? 2000,
      anisotropy: pick('anisotropy') ?? 4,
      gamma: pick('gamma') ?? 10,
      tau: pick('tau') ?? 0.08,
      matlab_iso: formProps['matlab_iso'] === 'on',
      K: pick('K'), kappa: pick('kappa'), dt: pick('dt'), eps0: pick('eps0'),
      delta: pick('delta'), u_infty: pick('u_infty'), Te: pick('Te'),
      noise_amp: pick('noise_amp'), frame_every: pick('frame_every'), r0: pick('r0'),
    };

    try {
      const res = await fetch('/api/run-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const { task_id } = await res.json();
      connectWebSocket(task_id);
    } catch (err: any) {
      setErrorText(err.message);
      setIsRunning(false);
    }
  };

  const connectWebSocket = (taskId: string) => {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${window.location.host}/api/ws/status/${taskId}`);
    wsRef.current = ws;

    ws.onopen = () => setStatusText('Status: Connected. Awaiting calculation...');

    ws.onmessage = (event) => {
      try {
        // 백엔드에서 텍스트 또는 JSON 형태의 메시지를 보낼 수 있으므로, 먼저 JSON 파싱을 시도
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (e) {
          // JSON 파싱 실패 시, 일반 텍스트 메시지로 간주
          const textData = event.data;
          if (textData.startsWith('failed:')) {
            throw new Error(textData);
          } else if (textData === 'completed') {
            setStatusText('Status: Completed!');
            setProgress(100);
            ws.close();
          } else { // Base64 이미지 데이터로 처리
             setResultImage(textData);
             setStatusText('Status: Streaming simulation...');
          }
          return;
        }

        // JSON 메시지 처리 로직 (보내주신 UI 참고)
        if (msg.type === 'params') {
          setParamsInUse(msg.data);
        } else if (msg.type === 'frame') {
          setResultImage(msg.data);
          const pct = Math.round((msg.step / msg.total_steps) * 100);
          setProgress(pct);
          setStatusText(`Status: step ${msg.step}/${msg.total_steps}`);
        } else if (msg.type === 'status' && msg.message === 'completed') {
          setStatusText('Status: Completed!');
          setProgress(100);
          ws.close();
        } else if (msg.type === 'status' && msg.message?.startsWith('failed')) {
          throw new Error(msg.message);
        }
      } catch (e: any) {
        setErrorText(e.message);
        ws.close();
      }
    };
    
    ws.onerror = () => setErrorText('WebSocket connection error. Please check the server status.');
    ws.onclose = () => setIsRunning(false);
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Phase-Field Simulation Service</h1>
        <p className="text-muted-foreground mt-2 text-lg">Interactive Dendritic Solidification Simulation (Kobayashi Model)</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Simulation Parameters</CardTitle></CardHeader>
            <CardContent>
              <form id="sim-form" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="grid_size">Grid Size</Label>
                    <Input id="grid_size" name="grid_size" type="number" defaultValue="256" min="64" max="400" step="16" />
                  </div>
                  <div>
                    <Label htmlFor="time_steps">Time Steps</Label>
                    <Input id="time_steps" name="time_steps" type="number" defaultValue="2000" min="100" />
                  </div>
                   <div>
                    <Label htmlFor="anisotropy">Anisotropy (m)</Label>
                    <Input id="anisotropy" name="anisotropy" type="number" defaultValue="4" step="1" />
                  </div>
                  <div>
                    <Label htmlFor="gamma">Gamma (arctan γ)</Label>
                    <Input id="gamma" name="gamma" type="number" defaultValue="10" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="tau">Tau</Label>
                    <Input id="tau" name="tau" type="number" defaultValue="0.08" step="0.001" />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="matlab_iso" name="matlab_iso" />
                    <Label htmlFor="matlab_iso">MATLAB isotropic mode</Label>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-params">
                      <AccordionTrigger>Advanced (optional)</AccordionTrigger>
                      <AccordionContent className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4">
                        <div><Label htmlFor="K">K</Label><Input id="K" name="K" type="number" step="0.1" placeholder="1.6" /></div>
                        <div><Label htmlFor="kappa">kappa</Label><Input id="kappa" name="kappa" type="number" step="0.01" placeholder="0.10" /></div>
                        <div><Label htmlFor="dt">dt</Label><Input id="dt" name="dt" type="number" step="0.0001" placeholder="0.002" /></div>
                        <div><Label htmlFor="eps0">eps0</Label><Input id="eps0" name="eps0" type="number" step="0.01" placeholder="0.9" /></div>
                        <div><Label htmlFor="delta">delta</Label><Input id="delta" name="delta" type="number" step="0.01" placeholder="0.10" /></div>
                        <div><Label htmlFor="u_infty">u_infty</Label><Input id="u_infty" name="u_infty" type="number" step="0.05" placeholder="-0.7" /></div>
                        <div><Label htmlFor="Te">Te (MATLAB)</Label><Input id="Te" name="Te" type="number" step="0.1" placeholder="1.0" /></div>
                        <div><Label htmlFor="noise_amp">noise_amp</Label><Input id="noise_amp" name="noise_amp" type="number" step="0.001" placeholder="0.003" /></div>
                        <div><Label htmlFor="frame_every">frame_every</Label><Input id="frame_every" name="frame_every" type="number" step="1" placeholder="10" /></div>
                        <div><Label htmlFor="r0">r0</Label><Input id="r0" name="r0" type="number" step="0.1" placeholder="3.5" /></div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isRunning}>
                  {isRunning ? 'Running...' : 'Run Simulation'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {paramsInUse && (
            <Card>
              <CardHeader><CardTitle>Parameters in Use</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(paramsInUse, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center border">
                <img id="result-img" src={resultImage || ''} alt="Simulation result" style={{ display: resultImage ? 'block' : 'none' }} className="max-w-full max-h-full" />
                {!resultImage && <span className="text-muted-foreground">Result will be displayed here</span>}
              </div>
              <div className="mt-4 space-y-2">
                <Progress value={progress} />
                <div id="status-text" className="text-sm text-muted-foreground">{statusText}</div>
                {errorText && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {errorText}
                    </AlertDescription>
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