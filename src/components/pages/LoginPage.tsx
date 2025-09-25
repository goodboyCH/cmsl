// LoginPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import Turnstile from 'react-turnstile';           // ⬅️ 추가

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // ⬅️ 추가

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken: captchaToken ?? undefined },        // ⬅️ 추가
      });

      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Turnstile 위젯: 비번 재설정 페이지와 동일한 sitekey 사용 */}
            <Turnstile
              sitekey="0x4AAAAAAB3LouKPKufvRqXV"
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              onError={() => setCaptchaToken(null)}
            />

            <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
            {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
          </form>

          <div className="text-center mt-4">
            <Button variant="link" asChild>
              <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
