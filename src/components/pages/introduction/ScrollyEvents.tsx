"use client";

// 1. Level 2 훅을 임포트합니다. (Waypoint 제거)
import { useScrollytelling } from '@bsmnt/scrollytelling';
// 2. useEffect를 임포트합니다 (비-시각적 작업이므로)
import React, { useEffect } from 'react';

// 이 컴포넌트는 Supabase 데이터가 필요 없습니다.
// UI가 없는 순수 이벤트 트리거입니다.
export function ScrollyEvents() {
  
  // 3. 'Level 2' 훅을 사용해 마스터 타임라인을 가져옵니다.
  const { timeline } = useScrollytelling();

  useEffect(() => {
    // 4. 타임라인이 준비되었는지 확인
    if (!timeline) return;

    // 5. 'timeline.call()'을 사용해 '악보'에 명시된 시점에 콜백을 '등록'합니다.
    
    // 씬 3 진입 시 Navbar 색상 변경 이벤트 (onEnter)
    timeline.call(() => {
      // (실제 Navbar 변경 로직)
      console.log("Waypoint: 29% (Enter Section 3) - Navbar Black");
    }, [], 0.29); // '악보'의 29% 지점에 콜백 등록

    // 데모 종료 시 GA 이벤트 전송 이벤트 (onEnter)
    timeline.call(() => {
      // (실제 GA 이벤트 전송 로직)
      console.log("Waypoint: 70% (Enter Section 5) - Send GA Event");
    }, [], 0.70); // '악보'의 70% 지점에 콜백 등록

    // (참고: onLeaveBack은 제가 잘못 추측한 <Waypoint>의 가상 API였습니다.
    //  'onEnter' 콜백만 등록하는 것이 Level 2 훅 방식의 올바른 구현입니다.)

  }, [timeline]); // timeline이 준비되면 1번만 실행

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}