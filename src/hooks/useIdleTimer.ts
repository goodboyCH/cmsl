import { useEffect, useRef } from 'react';

interface IdleTimerProps {
  onIdle: () => void;
  idleTime: number; // 분 단위
  enabled?: boolean; // 1. 타이머를 활성화할지 여부를 결정하는 옵션 추가
}

export function useIdleTimer({ onIdle, idleTime, enabled = true }: IdleTimerProps) {
  const timeoutId = useRef<NodeJS.Timeout>();

  // 2. useEffect 로직을 onIdle, idleTime, enabled 값이 변경될 때마다 재실행하도록 수정
  useEffect(() => {
    // 3. enabled가 false이면, 타이머를 설정하거나 이벤트를 감지하는 모든 로직을 건너뜁니다.
    if (!enabled) {
      return;
    }

    const startTimer = () => {
      timeoutId.current = setTimeout(() => {
        onIdle();
      }, idleTime * 60 * 1000);
    };

    const resetTimer = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      startTimer();
    };

    const handleActivity = () => {
      resetTimer();
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    startTimer();

    // 클린업 함수: 컴포넌트가 사라지거나, enabled 상태가 false로 바뀔 때 실행됩니다.
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [idleTime, onIdle, enabled]);
}