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
  const [sessionReady, setSessionReady] = useState(false); // 1. 세션 준비 상태를 관리하는 state 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Supabase의 인증 상태 변경 이벤트를 감지하는 리스너를 설정합니다.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // 'PASSWORD_RECOVERY' 이벤트가 발생하면 Supabase가 토큰 처리를 완료하고
      // 임시 세션을 생성했다는 의미입니다.
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    return () => {
      // 컴포넌트가 사라질 때 리스너를 정리합니다.
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
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. 세션이 준비되지 않았다면, "Verifying..." 메시지를 표시합니다.
  if (!sessionReady) {
    // URL에 토큰이 있는지 간단히 확인하여 유효하지 않은 접근을 걸러낼 수 있습니다.
    if (!window.location.hash.includes('access_token')) {
      return (
         <div className="max-w-sm mx-auto px-4 py-20 text-center">
           <Card>
             <CardHeader>
               <CardTitle>Error</CardTitle>
               <CardDescription>Invalid or expired password reset link.</CardDescription>
             </CardHeader>
           </Card>
         </div>
      );
    }
    return <p className="text-center p-20">Verifying...</p>;
  }

  // 4. 세션이 준비된 후에만 비밀번호 설정 폼을 보여줍니다.
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