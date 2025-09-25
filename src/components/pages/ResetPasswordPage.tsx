import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 받은 코드를 세션으로 교환하는 함수
  const verifyAndExchangeCode = useCallback(async (code: string) => {
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        throw exchangeError;
      }
      // 성공 시 Supabase 클라이언트에 세션이 설정됩니다.
      setIsVerifying(false);
    } catch (err) {
      if (err instanceof Error) {
        setError("유효하지 않거나 만료된 재설정 링크입니다. 다시 시도해주세요.");
      }
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    // URL의 ?code=... 부분을 추출합니다.
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      verifyAndExchangeCode(code);
    } else {
      setError("유효하지 않은 접근입니다.");
      setIsVerifying(false);
    }
  }, [location.search, verifyAndExchangeCode]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage('비밀번호가 성공적으로 변경되었습니다. 2초 후 로그인 페이지로 이동합니다.');
      setTimeout(() => navigate('/cmsl2004'), 2000);
    } catch (err: any) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return <p className="text-center p-20">Verifying...</p>;
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle>새 비밀번호 설정</CardTitle>
          <CardDescription>사용할 새 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-red-500 pt-2 text-center">{error}</p>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">새 비밀번호 (6자 이상)</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '변경 중...' : '비밀번호 변경 완료'}
              </Button>
              {message && <p className="text-sm text-green-600 pt-2">{message}</p>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}