// src/components/pages/VtiViewerPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { VtkViewer } from '@/components/VtkViewer'; // 2단계에서 만든 뷰어 임포트

export function VtiViewerPage() {
  const [vtiUrl, setVtiUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setVtiUrl(null);
      setError(null);
      return;
    }

    // 파일 확장자 검사
    if (!file.name.endsWith('.vti')) {
      setError('Invalid file type. Please upload a .vti file.');
      setVtiUrl(null);
      return;
    }

    setError(null);

    // FileReader를 사용해 파일을 dataURL로 변환 (Base64 인코딩된 URL)
    const reader = new FileReader();
    reader.onload = (e) => {
      // 변환된 dataURL을 VtkViewer에 전달
      setVtiUrl(e.target?.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    
    // 읽기 시작
    reader.readAsDataURL(file);
  };

  return (
    <div className="container py-8 px-4 md:px-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          3D VTI Viewer
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload a .vti file to render it directly in your browser.
        </p>
      </header>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* --- 왼쪽: 파일 컨트롤 --- */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>File Control</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="vti-upload">Upload .vti File</Label>
                <Input
                  id="vti-upload"
                  type="file"
                  accept=".vti" // .vti 파일만 선택 가능하도록 필터링
                  onChange={handleFileChange}
                />
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- 오른쪽: 뷰어 --- */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent>
              {/* vtiUrl이 있을 때만 VtkViewer를 렌더링하고, 
                없을 때는 플레이스홀더를 보여줍니다.
              */}
              {vtiUrl ? (
                <VtkViewer vtiUrl={vtiUrl} />
              ) : (
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center border">
                  <span className="text-muted-foreground">
                    Please upload a file to display
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}