import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SinglePopupDialog } from './SinglePopupDialog'; // 1. 방금 만든 컴포넌트 import

interface PopupData {
  id: number;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
}

export function SitePopup() {
  const [activePopups, setActivePopups] = useState<PopupData[]>([]);

  useEffect(() => {
    const fetchAllActivePopups = async () => {
      // 2. 활성화된(is_active = true) 팝업을 '모두' 불러옵니다. (limit 제거)
      const { data } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setActivePopups(data);
      }
    };
    fetchAllActivePopups();
  }, []); // 페이지 로드 시 한 번만 실행

  // 3. 불러온 팝업 목록을 .map()으로 순회하며 각각의 다이얼로그를 렌더링합니다.
  //    각 다이얼로그는 SinglePopupDialog 컴포넌트 내부의 로직에 따라 스스로 표시 여부를 결정합니다.
  return (
    <>
      {activePopups.map(popup => (
        <SinglePopupDialog key={popup.id} popup={popup} />
      ))}
    </>
  );
} 