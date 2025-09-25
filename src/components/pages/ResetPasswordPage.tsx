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
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 페이지가 로드되면, Supabase가 URL의 토큰을 처리할 시간을 잠시 줍니다. (예: 500ms)
    //    그 후, 현재 세션 정보가 있는지 직접 확인합니다.
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // 세션이 성공적으로 복구되었으면, 검증 완료로 처리합니다.
          setIsVerified(true);
        } else {
          // 시간이 지나도 세션이 없으면, 링크가 만료되었거나 잘못된 것으로 간주합니다.
          setError("유효하지 않거나 만료된 재설정 링크입니다. 다시 시도해주세요.");
        }
      });
    }, 500);

    return () => clearTimeout(timer); // 컴포넌트가 사라지면 타이머 정리
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

  // 2. 검증이 완료되기 전까지는 "Verifying..." 또는 에러 메시지를 표시합니다.
  if (!isVerified) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        {error ? (
          <Card>
            <CardHeader>
              <CardTitle>오류</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <p>Verifying...</p>
        )}
      </div>
    );
  }
  
  // 3. 검증이 완료된 후에만 폼을 보여줍니다.
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
            {/* 비밀번호 업데이트 시 발생하는 오류는 여기에 표시됩니다. */}
            {message ? <p className="text-sm text-green-600 pt-2">{message}</p> : <p className="text-sm text-red-500 pt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}