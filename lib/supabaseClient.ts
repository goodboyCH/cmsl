'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 클라이언트 사이드에서만 Supabase 클라이언트 생성
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 빈 URL로 인스턴스 생성 방지
    if (!supabaseUrl || !supabaseAnonKey) {
      // 더미 클라이언트 반환 (빌드 시에만 사용됨)
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not set');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // 세션 정보를 localStorage 대신 sessionStorage에 저장하도록 변경합니다.
        storage: window.sessionStorage,
        // 세션이 만료되거나 브라우저가 닫혔을 때 자동으로 세션을 갱신하지 않도록 설정합니다.
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();
