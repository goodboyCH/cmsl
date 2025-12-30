import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SinglePopupDialog } from './SinglePopupDialog'; 

interface PopupData {
  id: number;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
  styles: { 
    popupSize: 'sm' | 'md' | 'lg';
    imageSize: 'full' | 'contain';
    textSize: 'sm' | 'base' | 'lg';
  };
}

export function SitePopup() {
  const [activePopups, setActivePopups] = useState<PopupData[]>([]);

  useEffect(() => {
    const fetchAllActivePopups = async () => {
      const { data } = await supabase
        .from('popups')
        .select('id, title, content, image_url, link_url, styles')
        .eq('is_active', true)
        .order('created_at', { ascending: false }); // 가장 최근 팝업이 0번째가 됨
      
      if (data) {
        setActivePopups(data as PopupData[]);
      }
    };
    fetchAllActivePopups();
  }, []); 

  return (
    <>
      {/* --- ⬇️ 겹침 문제 해결: .map() 대신 첫 번째 항목만 렌더링 ⬇️ --- */}
      {activePopups.length > 0 && (
        <SinglePopupDialog key={activePopups[0].id} popup={activePopups[0]} />
      )}
      {/* --- ⬆️ 수정 완료 ⬆️ --- */}
    </>
  );
}