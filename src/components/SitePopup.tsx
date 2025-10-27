import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SinglePopupDialog } from './SinglePopupDialog'; // 1. 방금 만든 컴포넌트 import

interface PopupData {
  id: number;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
  styles: { // 2. styles 타입을 명확히 정의합니다.
    popupSize: 'sm' | 'md' | 'lg';
    imageSize: 'full' | 'contain';
    textSize: 'sm' | 'base' | 'lg';
  };
}

export function SitePopup() {
  const [activePopups, setActivePopups] = useState<PopupData[]>([]);

  useEffect(() => {
    const fetchAllActivePopups = async () => {
      // 3. ⬇️ select 쿼리에 'styles'를 추가합니다. ⬇️
      const { data } = await supabase
        .from('popups')
        .select('id, title, content, image_url, link_url, styles')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setActivePopups(data as PopupData[]);
      }
    };
    fetchAllActivePopups();
  }, []); // 페이지 로드 시 한 번만 실행

  return (
    <>
      {activePopups.map(popup => (
        <SinglePopupDialog key={popup.id} popup={popup} />
      ))}
    </>
  );
}