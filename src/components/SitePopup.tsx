import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';

const POPUP_STORAGE_KEY_PREFIX = 'cmsl-popup-seen-';

interface PopupData {
  id: number;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
}

export function SitePopup() {
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      // 1. 활성화된(is_active = true) 팝업을 하나 불러옵니다.
      const { data } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        // 2. 팝업을 본 기록이 있는지 확인합니다. (키에 팝업 ID를 포함)
        const storageKey = `${POPUP_STORAGE_KEY_PREFIX}${data.id}`;
        const hasSeen = localStorage.getItem(storageKey);
        
        if (!hasSeen) {
          setPopupData(data);
          setIsOpen(true);
        }
      }
    };
    fetchPopup();
  }, []);

  const handleClose = () => {
    if (popupData) {
      // 3. "오늘 하루 보지 않기" 로직 (ID별로 저장)
      const storageKey = `${POPUP_STORAGE_KEY_PREFIX}${popupData.id}`;
      localStorage.setItem(storageKey, 'true');
    }
    setIsOpen(false);
  };
  
  const handleLinkClick = () => {
    if (popupData?.link_url) {
      window.open(popupData.link_url, '_blank');
    }
    handleClose();
  };

  if (!isOpen || !popupData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{popupData.title}</DialogTitle>
          {popupData.content && (
            <DialogDescription>{popupData.content}</DialogDescription>
          )}
        </DialogHeader>
        {popupData.image_url && (
          <div className="py-4">
            <img src={popupData.image_url} alt={popupData.title} className="w-full rounded-md" />
          </div>
        )}
        <DialogFooter className="sm:justify-between gap-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            오늘 하루 보지 않기
          </Button>
          <Button type="button" onClick={handleLinkClick} disabled={!popupData.link_url}>
            자세히 보기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}