// src/components/pages/SimulationPage.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Status: Ready.');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId || !isRunning) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/api/results/${taskId}`, {
          // ===== ⬇️ ngrok 경고를 건너뛰기 위한 헤더 추가 ⬇️ =====
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (res.headers.get('Content-Type')?.includes('image')) {
          const imageBlob = await res.blob();
          setResultImage(URL.createObjectURL(imageBlob));
          setStatusText('Status: Completed!');
          setIsRunning(false);
          setTaskId(null);
          clearInterval(interval);
        } else {
          const json = await res.json();
          if (json.status === 'failed') throw new Error(json.error);
        }
      } catch (err: any) {
        setErrorText(err.message);
        setIsRunning(false);
        setTaskId(null);
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [taskId, isRunning]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!backendUrl) { setErrorText('Backend URL is not configured.'); return; }
    setIsRunning(true);
    setStatusText('Status: Sending request to backend...');
    setErrorText(null);
    setResultImage(null);
    setTaskId(null);

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      im: (formData.get('im') as string) || '100',
      jm: (formData.get('jm') as string) || '100',
      nnn_ed: (formData.get('nnn_ed') as string) || '2000',
      Nout: (formData.get('Nout') as string) || '100',
      driv: (formData.get('driv') as string) || '0.1',
    });

    try {
      const res = await fetch(`${backendUrl}/api/run-simulation?${params.toString()}`, {
        // ===== ⬇️ ngrok 경고를 건너뛰기 위한 헤더 추가 ⬇️ =====
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const data = await res.json();
      setTaskId(data.task_id);
      setStatusText(`Status: Task [${data.task_id}] is running...`);
    } catch (err: any) {
      setErrorText(err.message);
      setIsRunning(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">PFM Simulation (Python on Colab)</h1>
        <p className="text-muted-foreground mt-2 text-lg">Grain Shrinkage Simulation powered by Python/NumPy</p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Simulation Parameters</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="im">Grid Size X (im)</Label><Input id="im" name="im" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="jm">Grid Size Y (jm)</Label><Input id="jm" name="jm" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="nnn_ed">Total Timesteps (nnn_ed)</Label><Input id="nnn_ed" name="nnn_ed" type="number" defaultValue="2000" /></div>
                <div><Label htmlFor="Nout">Output Interval (Nout)</Label><Input id="Nout" name="Nout" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="driv">Driving Force (driv)</Label><Input id="driv" name="driv" type="number" step="0.01" defaultValue="0.1" /></div>
                <Button type="submit" className="w-full !mt-6" disabled={isRunning}>
                  {isRunning ? 'Running on Colab...' : 'Start Simulation'}
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
                {isRunning && <Progress value={undefined} className="[&>div]:animate-pulse" />}
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