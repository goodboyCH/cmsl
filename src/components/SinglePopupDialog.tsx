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

// '오늘 하루 보지 않기'를 위한 키 (localStorage 사용)
const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';

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

interface SinglePopupDialogProps {
  popup: PopupData;
}

export function SinglePopupDialog({ popup }: SinglePopupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const styles = popup.styles || { popupSize: 'md', imageSize: 'full', textSize: 'base' };
  const localStorageKey = `${POPUP_LOCAL_STORAGE_PREFIX}${popup.id}`;

  useEffect(() => {
    // 1. '오늘 하루 보지 않기'를 눌렀는지 (localStorage)만 확인합니다.
    const hasSeenToday = localStorage.getItem(localStorageKey);
    
    // 2. 'sessionStorage' 확인 로직을 삭제했습니다.
    if (!hasSeenToday) {
      setIsOpen(true);
    }
  }, [localStorageKey]);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
    
    // 3. 'sessionStorage' 저장 로직을 삭제했습니다.
    
    // 4. '오늘 하루 보지 않기'를 누른 경우에만 localStorage에 기록합니다.
    if (dontShowAgain) {
      localStorage.setItem(localStorageKey, 'true');
    }
  };

  const handleLinkClick = () => {
    if (popup.link_url) {
      window.open(popup.link_url, '_blank');
    }
    handleClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose(false)}>
      <DialogContent className={`
        ${styles.popupSize === 'sm' && 'sm:max-w-sm'}
        ${styles.popupSize === 'md' && 'sm:max-w-md'}
        ${styles.popupSize === 'lg' && 'sm:max-w-lg'}
      `}>
        <DialogHeader>
          <DialogTitle className={`
            ${styles.textSize === 'lg' && 'text-2xl'}
            ${styles.textSize === 'sm' && 'text-base'}
          `}>{popup.title}</DialogTitle>
          <DialogDescription className={`
            ${styles.textSize === 'lg' && 'text-base'}
            ${styles.textSize === 'sm' && 'text-xs'}
          `}>{popup.content}</DialogDescription>
        </DialogHeader>
        {popup.image_url && (
          <div className="py-4">
            <img src={popup.image_url} alt={popup.title} className={`w-full rounded-md ${styles.imageSize === 'contain' && 'object-contain h-64'}`} />
          </div>
        )}
        <DialogFooter className="sm:justify-between gap-2">
          <Button type="button" variant="ghost" onClick={() => handleClose(true)}>
            오늘 하루 보지 않기
          </Button>
          <Button type="button" onClick={handleLinkClick} disabled={!popup.link_url}>
            자세히 보기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}