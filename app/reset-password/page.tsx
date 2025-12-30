import { Suspense } from 'react';
import { ResetPasswordPage } from '@/components/pages/ResetPasswordPage';

function ResetPasswordLoading() {
  return <p className="text-center p-20">Loading...</p>;
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
