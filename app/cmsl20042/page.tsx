'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AdminPage2 } from '@/components/pages/AdminPage2';
import { LoginPage } from '@/components/pages/LoginPage';

export default function Admin2() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-[80vh] w-full flex items-center justify-center">Loading...</div>;
  }

  return session ? <AdminPage2 /> : <LoginPage />;
}
