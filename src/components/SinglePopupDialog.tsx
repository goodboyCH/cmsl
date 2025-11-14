import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Draggable from 'react-draggable'; 
import { X } from 'lucide-react'; 
import 'react-quill/dist/quill.snow.css';

const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';

interface PopupData {
  id: number;
  title: string;
  content: string; 
  image_url: string;
  link_url: string;
}

interface SinglePopupDialogProps {
  popup: PopupData;
  index: number; // 1. SitePopup에서 전달받을 index prop 추가
}

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// 2. props에서 index를 받도록 수정
export function SinglePopupDialog({ popup, index }: SinglePopupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localStorageKey = `${POPUP_LOCAL_STORAGE_PREFIX}${popup.id}`;

  useEffect(() => {
    const storedDate = localStorage.getItem(localStorageKey);
    const today = getTodayDateString();
    
    if (storedDate !== today) {
      setIsOpen(true);
    }
  }, [localStorageKey]);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
    
    if (dontShowAgain) {
      const today = getTodayDateString();
      localStorage.setItem(localStorageKey, today);
    }
  };

  const handleLinkClick = () => {
    if (popup.link_url) {
      window.open(popup.link_url, '_blank');
    }
    handleClose(false);
  };

  if (!isOpen) {
    return null;
  }

  // 3. index 값에 따라 계단식으로 위치를 계산합니다.
  // 1rem(16px) + (index * 2rem(32px))
  const offset = 16 + (index * 32);

  return (
    // 4. Draggable에 defaultPosition을 설정합니다.
    <Draggable 
      handle=".drag-handle" 
      defaultPosition={{ x: offset, y: offset }} // X, Y 위치를 index에 따라 설정
    >
      {/* --- ⬇️ 팝업 위치 클래스(top-4 left-4) 제거 ⬇️ --- */}
      {/* Draggable이 위치를 제어하므로 top/left 클래스는 제거합니다. */}
      <div className="fixed z-50 w-auto max-w-[90vw] sm:max-w-lg bg-background border rounded-lg shadow-lg">
        
        <div className="drag-handle flex justify-between items-center p-4 cursor-move bg-primary text-primary-foreground rounded-t-lg">
          <h3 className="font-semibold text-xl text-primary-foreground">{popup.title}</h3>
          <Button variant="ghost" size="icon" onClick={() => handleClose(false)} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div 
          className="p-4 ql-snow"
        >
          <div 
            className="ql-editor overflow-x-hidden"
            style={{ padding: 0 }} 
            dangerouslySetInnerHTML={{ __html: popup.content }} 
          />
        </div>
        
        <div className="flex justify-between items-center p-2 border-t bg-muted/50 rounded-b-lg">
          <Button type="button" variant="ghost" onClick={() => handleClose(true)}>
            오늘 하루 보지 않기
          </Button>
          <Button type="button" onClick={handleLinkClick} disabled={!popup.link_url}>
            자세히 보기
          </Button>
        </div>
      </div>
    </Draggable>
  );
}