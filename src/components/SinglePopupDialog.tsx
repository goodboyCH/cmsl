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

const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';
const POPUP_SESSION_STORAGE_PREFIX = 'cmsl-popup-session-closed-';

interface PopupData {
  id: number;
  title: string;
  content: string;
  image_url: string;
  link_url: string;
  styles: { // 1. styles prop을 받습니다.
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
  
  // 2. 스타일이 없거나 기본값일 경우를 대비
  const styles = popup.styles || { popupSize: 'md', imageSize: 'full', textSize: 'base' };
  
  const localStorageKey = `${POPUP_LOCAL_STORAGE_PREFIX}${popup.id}`;
  const sessionStorageKey = `${POPUP_SESSION_STORAGE_PREFIX}${popup.id}`;

  useEffect(() => {
    // 1. 팝업을 본 기록이 있는지 확인합니다.
    const hasSeenToday = localStorage.getItem(localStorageKey);
    const hasClosedThisSession = sessionStorage.getItem(sessionStorageKey);

    // 2. 두 기록이 모두 없을 때만 팝업을 띄웁니다.
    if (!hasSeenToday && !hasClosedThisSession) {
      setIsOpen(true);
    }
  }, [localStorageKey, sessionStorageKey]); // 컴포넌트 마운트 시 한 번만 실행

  const handleClose = (dontShowAgain = false) => {
    // 3. 팝업을 닫습니다.
    setIsOpen(false);
    
    // 4. '오늘 하루 보지 않기'를 누르지 않아도, '이번 세션'에서는 닫힌 것으로 기록합니다.
    sessionStorage.setItem(sessionStorageKey, 'true');

    // 5. '오늘 하루 보지 않기'를 누른 경우에만 localStorage에 영구 기록합니다.
    if (dontShowAgain) {
      localStorage.setItem(localStorageKey, 'true');
    }
  };

  const handleLinkClick = () => {
    if (popup.link_url) {
      window.open(popup.link_url, '_blank');
    }
    handleClose(false); // 링크 클릭 시에도 '오늘 하루 보지 않기'는 적용하지 않습니다.
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose(false)}>
      {/* 3. ⬇️ DialogContent에 동적 클래스를 적용합니다. ⬇️ */}
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