import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 1. 기존 createClient 호출 코드
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. 아래와 같이 수정합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 세션 정보를 localStorage 대신 sessionStorage에 저장하도록 변경합니다.
    storage: window.sessionStorage,
    // 세션이 만료되거나 브라우저가 닫혔을 때 자동으로 세션을 갱신하지 않도록 설정합니다.
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false,
  },
})