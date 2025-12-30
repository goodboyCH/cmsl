"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import React, { useEffect } from 'react';

export function ScrollyEvents() {
  const { timeline } = useScrollytelling();

  useEffect(() => {
    if (!timeline) return;

    // --- ⬇️ '새 악보' (2450%) 적용 ⬇️ ---
    // (S3 진입 시점: 8.5)
    timeline.call(() => {
      console.log("Waypoint: 9.5 (Enter Section 3) - Navbar Black");
    }, [], 9.5);

    // (S5 진입 시점: 17.5)
    timeline.call(() => {
      console.log("Waypoint: 20.5 (Enter Section 5) - Send GA Event");
    }, [], 20.5);
    // --- ⬆️ '새 악보' 적용 ⬆️ ---

  }, [timeline]);

  return null;
}
