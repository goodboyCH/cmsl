'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 빌드 시 환경변수가 없을 경우를 위한 기본값 (실제 Supabase URL 형식)
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

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
