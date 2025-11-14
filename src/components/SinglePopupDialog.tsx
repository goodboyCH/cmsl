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
  // styles는 이 컴포넌트에서 더 이상 사용되지 않습니다.
}

interface SinglePopupDialogProps {
  popup: PopupData;
}

// 1. 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환하는 헬퍼 함수
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export function SinglePopupDialog({ popup }: SinglePopupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localStorageKey = `${POPUP_LOCAL_STORAGE_PREFIX}${popup.id}`;

  useEffect(() => {
    // --- ⬇️ '오늘 하루 보지 않기' 로직 수정 ⬇️ ---
    // 2. localStorage에 저장된 날짜를 가져옵니다.
    const storedDate = localStorage.getItem(localStorageKey);
    // 3. 오늘 날짜를 가져옵니다.
    const today = getTodayDateString();
    
    // 4. 저장된 날짜가 오늘 날짜와 다를 경우에만 팝업을 엽니다.
    if (storedDate !== today) {
      setIsOpen(true);
    }
    // --- ⬆️ 수정 완료 ⬆️ ---
  }, [localStorageKey]);

  const handleClose = (dontShowAgain = false) => {
    setIsOpen(false);
    
    if (dontShowAgain) {
      // --- ⬇️ '오늘 하루 보지 않기' 로직 수정 ⬇️ ---
      // 5. 'true' 대신 오늘 날짜 문자열을 localStorage에 저장합니다.
      const today = getTodayDateString();
      localStorage.setItem(localStorageKey, today);
      // --- ⬆️ 수정 완료 ⬆️ ---
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

  // Draggable 팝업 UI (변경 없음)
  return (
    <Draggable handle=".drag-handle">
      <div className="fixed top-4 left-4 z-50 w-auto max-w-[90vw] sm:max-w-3xl bg-background border rounded-lg shadow-lg">
        
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