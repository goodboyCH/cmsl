import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sessionReady, setSessionReady] = useState(false); // 1. 세션 준비 상태를 관리
  const navigate = useNavigate();

  useEffect(() => {
    // 2. onAuthStateChange 리스너를 이 페이지에서 직접 사용합니다.
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      // Supabase가 URL 토큰 처리를 마치면 'PASSWORD_RECOVERY' 이벤트를 보냅니다.
      // 이 신호를 받으면, 세션이 준비되었다고 판단합니다.
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    // 컴포넌트가 사라질 때 리스너를 정리합니다.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('비밀번호가 성공적으로 변경되었습니다. 2초 후 로그인 페이지로 이동합니다.');
      setTimeout(() => navigate('/cmsl2004'), 2000);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Auth session missing')) {
          setError("세션이 만료되었습니다. 다시 비밀번호 재설정을 요청해주세요.");
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. 세션이 준비되기 전까지는 "Verifying..." 메시지를 표시합니다.
  if (!sessionReady) {
    // URL에 토큰이 없으면 잘못된 접근으로 간주합니다.
    if (!window.location.hash.includes('access_token')) {
      return (
         <div className="max-w-sm mx-auto px-4 py-20 text-center">
           <Card>
             <CardHeader>
               <CardTitle>Error</CardTitle>
               <CardDescription>유효하지 않거나 만료된 재설정 링크입니다.</CardDescription>
             </CardHeader>
           </Card>
         </div>
      );
    }
    return <p className="text-center p-20">Verifying...</p>;
  }

  // 4. 세션이 준비된 후에만 폼을 보여줍니다.
  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle>새 비밀번호 설정</CardTitle>
          <CardDescription>사용할 새 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호 (6자 이상)</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '변경 중...' : '비밀번호 변경 완료'}
            </Button>
            {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
            {message && <p className="text-sm text-green-600 pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}