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
        .order('created_at', { ascending: false }); 
      
      if (data) {
        setActivePopups(data as PopupData[]);
      }
    };
    fetchAllActivePopups();
  }, []); 

  return (
    <>
      {/* --- ⬇️ 겹침 문제 해결: .map()으로 변경하고 'index'를 전달 ⬇️ --- */}
      {activePopups.map((popup, index) => (
        <SinglePopupDialog 
          key={popup.id} 
          popup={popup} 
          index={index} // 팝업 순서를 prop으로 전달
        />
      ))}
      {/* --- ⬆️ 수정 완료 ⬆️ --- */}
    </>
  );
}