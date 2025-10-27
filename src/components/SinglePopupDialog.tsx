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

// Quill 콘텐츠 스타일을 위한 CSS import
import 'react-quill/dist/quill.snow.css';

const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';

interface PopupData {
  id: number;
  title: string;
  content: string; 
  image_url: string;
  link_url: string;
  // 1. styles 속성 제거
  // styles: { ... };
}

interface SinglePopupDialogProps {
  popup: PopupData;
}

export function SinglePopupDialog({ popup }: SinglePopupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. styles 변수 선언 제거
  // const styles = popup.styles || { ... };
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
      {/* 3. ⬇️ className을 수정하여 너비를 자동으로 조절합니다. ⬇️ */}
      <DialogContent className="w-auto max-w-[90vw] sm:max-w-3xl">
        <DialogHeader>
          {/* 4. ⬇️ DialogTitle에서 className 제거 ⬇️ */}
          <DialogTitle>{popup.title}</DialogTitle>
        </DialogHeader>

        <div 
          className="py-4 ql-snow" 
        >
          <div 
            className="ql-editor" 
            dangerouslySetInnerHTML={{ __html: popup.content }} 
          />
        </div>
        
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