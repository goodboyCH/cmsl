import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import Turnstile from 'react-turnstile';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('CAPTCHA verification failed. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: captchaToken,
      });

      if (error) throw error;
      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');

    } catch (err) { // ⬇️ 이 부분을 수정합니다.
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
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
            
            <Turnstile 
              sitekey="YOUR_SITE_KEY_HERE" // 여기에 Cloudflare에서 발급받은 Site Key를 입력하세요.
              onVerify={(token) => setCaptchaToken(token)}
            />

            <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
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