import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // 사용자가 링크를 클릭한 후, 비밀번호를 재설정할 페이지의 경로를 지정합니다.
        // 이 경로는 App.tsx의 Route path와 일치해야 합니다.
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');

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
          <CardTitle>비밀번호 재설정</CardTitle>
          <CardDescription>가입 시 사용한 이메일 주소를 입력하세요. 비밀번호 재설정 링크를 보내드립니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '전송 중...' : '재설정 링크 받기'}
            </Button>
            {message && <p className="text-sm text-green-600 pt-2">{message}</p>}
            {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
          </form>
          <div className="text-center mt-4">
            <Button variant="link" asChild>
              <Link to="/cmsl2004">로그인 페이지로 돌아가기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}