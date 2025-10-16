// src/components/pages/SimulationPage.tsx

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type SimulationType = 'grain_shrinkage' | 'dendrite_growth' | 'diffusion_1d';

export function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Status: Ready. Please select a simulation type.');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedSim, setSelectedSim] = useState<SimulationType>('grain_shrinkage');
  const wsRef = useRef<WebSocket | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wsRef.current) { try { wsRef.current.close(); } catch (e) {} }
    if (!backendUrl) { setErrorText('Backend URL is not configured.'); return; }

    setIsRunning(true);
    setStatusText('Status: Sending request to backend...');
    setErrorText(null);
    setResultImage(null);

    const formData = new FormData(event.currentTarget);
    const body: { [key: string]: any } = { simulation_type: selectedSim };
    formData.forEach((value, key) => {
      const numValue = Number(value);
      // 폼에 있는 모든 값을 일단 body에 추가합니다.
      if (value !== '') {
        body[key] = isNaN(numValue) ? value : numValue;
      }
    });

    try {
      const res = await fetch(`${backendUrl}/api/run-simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
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

    ws.onerror = () => setErrorText('WebSocket connection error. Check Colab server and URL.');
    ws.onclose = () => setIsRunning(false);
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Multi-Physics Simulation Service</h1>
        <p className="text-muted-foreground mt-2 text-lg">Powered by Python on Google Colab</p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Simulation Control</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs value={selectedSim} onValueChange={(value) => setSelectedSim(value as SimulationType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="grain_shrinkage">Grain Shrinkage</TabsTrigger>
                    <TabsTrigger value="dendrite_growth">Dendrite Growth</TabsTrigger>
                    <TabsTrigger value="diffusion_1d">1D Diffusion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grain_shrinkage" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">A 2D PFM model simulating the shrinkage of a circular grain (NumPy).</p>
                    <div><Label htmlFor="gs_im">Grid Size (im/jm)</Label><Input id="gs_im" name="im" type="number" defaultValue="100" /></div>
                    <div><Label htmlFor="gs_nnn_ed">Total Timesteps (nnn_ed)</Label><Input id="gs_nnn_ed" name="nnn_ed" type="number" defaultValue="2000" /></div>
                    <div><Label htmlFor="gs_Nout">Output Interval (Nout)</Label><Input id="gs_Nout" name="Nout" type="number" defaultValue="200" /></div>
                    <div><Label htmlFor="gs_driv">Driving Force (driv)</Label><Input id="gs_driv" name="driv" type="number" step="0.01" defaultValue="0.1" /></div>
                  </TabsContent>

                  <TabsContent value="dendrite_growth" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">A 2D Kobayashi model simulating dendritic crystal growth (FiPy).</p>
                    <div><Label htmlFor="dg_grid_size">Grid Size</Label><Input id="dg_grid_size" name="grid_size" type="number" defaultValue="128" /></div>
                    <div><Label htmlFor="dg_time_steps">Time Steps</Label><Input id="dg_time_steps" name="time_steps" type="number" defaultValue="300" /></div>
                    <div><Label htmlFor="dg_anisotropy">Anisotropy</Label><Input id="dg_anisotropy" name="anisotropy" type="number" step="1" defaultValue="6" /></div>
                    <div><Label htmlFor="dg_gamma">Gamma</Label><Input id="dg_gamma" name="gamma" type="number" step="0.1" defaultValue="10.0" /></div>
                    <div><Label htmlFor="dg_tau">Tau</Label><Input id="dg_tau" name="tau" type="number" step="0.0001" defaultValue="0.0003" /></div>
                  </TabsContent>

                  <TabsContent value="diffusion_1d" className="space-y-4 mt-4">
                     <p className="text-sm text-muted-foreground">A 1D FDM model for carburizing simulation (NumPy).</p>
                     <div><Label htmlFor="d1_t_max">Total Time (t_max)</Label><Input id="d1_t_max" name="t_max" type="number" defaultValue="1000" /></div>
                     <div><Label htmlFor="d1_x_max">Length (x_max)</Label><Input id="d1_x_max" name="x_max" type="number" step="0.0001" defaultValue="0.001" /></div>
                  </TabsContent>
                </Tabs>
                <Button type="submit" className="w-full mt-6" disabled={isRunning}>
                  {isRunning ? 'Running...' : 'Start Simulation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center border">
                {resultImage ? (
                  <img src={resultImage} alt="Simulation result" className="max-w-full max-h-full" />
                ) : (
                  <span className="text-muted-foreground">Result will be displayed here</span>
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