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
  const navigate = useNavigate();

  // Supabase는 재설정 링크를 통해 접속하면 자동으로 세션을 복구해줍니다.
  // 우리는 그저 새 비밀번호를 업데이트 해주기만 하면 됩니다.
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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