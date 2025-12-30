import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIChatAssistantProps {
  onUpdateParams: (type: string, params: any) => void;
}

export function AIChatAssistant({ onUpdateParams }: AIChatAssistantProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setReasoning(null);

    try {
      // 1. Vercel Serverless Function 호출
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('AI Server Error');

      const data = await res.json();
      
      // 2. 부모 컴포넌트로 데이터 전달 (파라미터 업데이트)
      if (data.params && data.simulation_type) {
        onUpdateParams(data.simulation_type, data.params);
        setReasoning(data.reasoning); // AI의 설명 표시
      }

    } catch (error) {
      console.error(error);
      setReasoning("AI 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="pt-6">
        <form onSubmit={handleAskAI} className="flex gap-2">
          <Input 
            placeholder="예: 눈송이처럼 육각형으로 자라는 거 보여줘" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="bg-white dark:bg-background"
          />
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </form>
        
        {/* AI 응답 메시지 (설명) */}
        {reasoning && (
          <div className="mt-3 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2 bg-white/50 dark:bg-black/20 p-2 rounded">
            <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{reasoning}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}