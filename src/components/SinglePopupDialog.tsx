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

// 1. Quill 콘텐츠 스타일을 위한 CSS import
import 'react-quill/dist/quill.snow.css';

const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';

interface PopupData {
  id: number;
  title: string;
  content: string; // content는 이제 HTML 문자열입니다.
  image_url: string; // 이 필드는 더 이상 사용되지 않을 수 있습니다.
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
    const hasSeenToday = localStorage.getItem(localStorageKey);
    if (!hasSeenToday) {
      setIsOpen(true);
    }
  }, [localStorageKey]);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
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
          
          {/* 2. DialogDescription 삭제 */}
          {/* <DialogDescription ...>{popup.content}</DialogDescription> */}
        </DialogHeader>

        {/* 3. ⬇️ 기존 이미지 표시 로직을 삭제하고 HTML 렌더링으로 변경 ⬇️ */}
        <div 
          className="py-4 ql-snow" // ql-snow 클래스로 감싸 Quill 스타일 적용
        >
          <div 
            className="ql-editor" // ql-editor 내부 스타일 적용
            dangerouslySetInnerHTML={{ __html: popup.content }} 
          />
        </div>
        {/* ⬆️ 변경 완료 ⬆️ */}
        
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