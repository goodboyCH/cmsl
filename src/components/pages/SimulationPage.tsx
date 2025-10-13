// src/components/pages/SimulationPage.tsx

import React, { useState, useRef  } from 'react';
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
    const wsRef = useRef<WebSocket | null>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (wsRef.current) { try { wsRef.current.close(); } catch (e) {} }
  
      setIsRunning(true);
      setStatusText('Status: Sending request to Fortran backend on Colab...');
      setErrorText(null);
      setResultImage(null);
  
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
        setStatusText(`Status: Task [${data.task_id}] is running...`);
        connectWebSocket(data.task_id);
      } catch (err: any) {
        setErrorText(err.message);
        setIsRunning(false);
      }
    };
  
    const connectWebSocket = (taskId: string) => {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${proto}://${window.location.host}/api/ws/status/${taskId}`);
      wsRef.current = ws;
  
      ws.onopen = () => setStatusText('Status: Connected. Streaming results from Colab...');
  
      ws.onmessage = (event) => {
        const message = event.data;
        if (message === 'completed') {
          setStatusText('Status: Completed!');
          ws.close();
        } else if (message.startsWith('failed:')) {
          setErrorText(message);
          ws.close();
        } else {
          // 메시지가 Base64 이미지 데이터라고 간주
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
          <h1 className="text-4xl font-bold tracking-tight text-primary">PFM Simulation (Fortran on Colab)</h1>
          <p className="text-muted-foreground mt-2 text-lg">Grain Shrinkage Simulation powered by Fortran</p>
        </header>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle>Fortran Parameters</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 폼 입력 부분은 변경 없음 */}
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
          <div className="lg-col-span-2">
            {/* 결과 표시 부분은 변경 없음 (Progress 바는 이제 필요 없으므로 제거 가능) */}
          </div>
        </div>
      </div>
    );
  }