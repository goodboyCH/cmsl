'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 환경변수 또는 직접 값 사용 (anon key는 공개되어도 RLS로 보호됨)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjaickjcmdxrsormsgve.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYWlja2pjbWR4cnNvcm1zZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjM3NDgsImV4cCI6MjA3MzYzOTc0OH0.1DxYsqXO2QkL-8JKYjFd78S71q82X1L1Cxf6rQIkE_k';

// 클라이언트 사이드에서만 Supabase 클라이언트 생성
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  // 서버 사이드 (빌드 시점 포함)
  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // 클라이언트 사이드
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: window.sessionStorage,
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();
