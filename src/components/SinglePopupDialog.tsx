import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Draggable from 'react-draggable'; // 1. react-draggable import
import { X } from 'lucide-react'; // 2. 닫기 아이콘 import
import 'react-quill/dist/quill.snow.css';

// '오늘 하루 보지 않기'를 위한 키 (localStorage 사용)
const POPUP_LOCAL_STORAGE_PREFIX = 'cmsl-popup-seen-';

interface PopupData {
  id: number;
  title: string;
  content: string; 
  image_url: string;
  link_url: string;
  // styles 속성은 이제 사용되지 않습니다.
}

interface SinglePopupDialogProps {
  popup: PopupData;
}

export function SinglePopupDialog({ popup }: SinglePopupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localStorageKey = `${POPUP_LOCAL_STORAGE_PREFIX}${popup.id}`;

  useEffect(() => {
    // 1. '오늘 하루 보지 않기'를 눌렀는지 (localStorage)만 확인합니다.
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

  // 3. 팝업이 닫혀있으면 아무것도 렌더링하지 않습니다.
  if (!isOpen) {
    return null;
  }

  // 4. ⬇️ Dialog 대신 Draggable 컴포넌트를 사용합니다. ⬇️
  return (
    <Draggable handle=".drag-handle">
      {/* 요청 1: fixed top-4 left-4 (좌측 상단 위치)
        요청 2: 별도 오버레이(뒷배경) 없음
        요청 3: Draggable 컴포넌트로 감싸 드래그 기능 구현
      */}
      <div className="fixed top-4 left-4 z-50 w-auto max-w-[90vw] sm:max-w-3xl bg-background border rounded-lg shadow-lg">
        
        {/* 5. 드래그 핸들(.drag-handle)이 적용된 헤더 */}
        <div className="drag-handle flex justify-between items-center p-4 cursor-move bg-primary text-primary-foreground rounded-t-lg">
          <h3 className="font-semibold text-xl text-primary-foreground">{popup.title}</h3>
          <Button variant="ghost" size="icon" onClick={() => handleClose(false)} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 6. Quill 콘텐츠 렌더링 (기존과 동일) */}
        <div 
          className="p-4 ql-snow" // 콘텐츠 영역에 패딩 추가
        >
          <div 
            className="ql-editor overflow-x-hidden"
            style={{ padding: 0 }} // ql-editor 자체의 기본 패딩은 제거
            dangerouslySetInnerHTML={{ __html: popup.content }} 
          />
        </div>
        
        {/* 7. 푸터 (기존과 동일) */}
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