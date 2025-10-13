// src/components/pages/SimulationPage.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function SimulationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [statusText, setStatusText] = useState('Status: Ready.');
    const [errorText, setErrorText] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
  
    // ===== ⬇️ useEffect 부분을 수정합니다 ⬇️ =====
    useEffect(() => {
      if (!taskId || !isRunning) return;
  
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/results/${taskId}`);
          if (!res.ok) { // 서버 에러 처리
              const errorData = await res.json();
              throw new Error(errorData.error || `Server error: ${res.status}`);
          }
  
          const json = await res.json();
          
          if (json.status === 'completed' && json.image_base64) {
            // Base64 문자열을 직접 src에 설정
            setResultImage(`data:image/png;base64,${json.image_base64}`);
            setStatusText('Status: Completed!');
            setIsRunning(false);
            setTaskId(null);
            clearInterval(interval);
          } else if (json.status === 'failed') {
            throw new Error(json.error);
          }
          // 'processing' 상태일 때는 아무것도 하지 않고 다음 폴링을 기다림
        } catch (err: any) {
          setErrorText(err.message);
          setIsRunning(false);
          setTaskId(null);
          clearInterval(interval);
        }
      }, 2000); // 2초마다 확인
  
      return () => clearInterval(interval);
    }, [taskId, isRunning]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRunning(true);
    setStatusText('Status: Sending request to Fortran backend on Colab...');
    setErrorText(null);
    setResultImage(null);
    setTaskId(null);

    const formData = new FormData(event.currentTarget);
    const body = {
      im: parseInt(formData.get('im') as string) || 100,
      jm: parseInt(formData.get('jm') as string) || 100,
      nnn_ed: parseInt(formData.get('nnn_ed') as string) || 2000,
      Nout: parseInt(formData.get('Nout') as string) || 100,
      driv: parseFloat(formData.get('driv') as string) || 0.1,
    };

    try {
      const res = await fetch('/api/run-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const data = await res.json();
      setTaskId(data.task_id);
      setStatusText(`Status: Task [${data.task_id}] is running on Colab...`);
    } catch (err: any) {
      setErrorText(err.message);
      setIsRunning(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">PFM Simulation (Fortran on Colab)</h1>
        <p className="text-muted-foreground mt-2 text-lg">Grain Shrinkage Simulation powered by Fortran</p>
      </header>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Fortran Parameters</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="im">Grid Size X (im)</Label><Input id="im" name="im" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="jm">Grid Size Y (jm)</Label><Input id="jm" name="jm" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="nnn_ed">Total Timesteps (nnn_ed)</Label><Input id="nnn_ed" name="nnn_ed" type="number" defaultValue="2000" /></div>
                <div><Label htmlFor="Nout">Output Interval (Nout)</Label><Input id="Nout" name="Nout" type="number" defaultValue="100" /></div>
                <div><Label htmlFor="driv">Driving Force (driv)</Label><Input id="driv" name="driv" type="number" step="0.01" defaultValue="0.1" /></div>
                <Button type="submit" className="w-full !mt-6" disabled={isRunning}>
                  {isRunning ? 'Running on Colab...' : 'Start Fortran Simulation'}
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