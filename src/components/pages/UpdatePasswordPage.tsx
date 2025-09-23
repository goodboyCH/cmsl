// src/components/pages/UpdatePasswordPage.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // supabase 클라이언트에 내장된 updateUser 기능으로 비밀번호를 업데이트합니다.
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      
      setMessage('비밀번호가 성공적으로 설정되었습니다. 잠시 후 메인 페이지로 이동합니다.');
      
      // 성공 후 2초 뒤에 홈으로 이동
      setTimeout(() => {
        navigate('/');
      }, 2000);

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
          <CardTitle>비밀번호 설정</CardTitle>
          <CardDescription>관리자 계정에 사용할 새 비밀번호를 설정하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '설정 중...' : '비밀번호 설정 완료'}
            </Button>
            {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
            {message && <p className="text-sm text-green-600 pt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}