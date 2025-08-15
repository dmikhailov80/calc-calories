'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseInfoTooltipReturn {
  showInfo: boolean;
  toggleInfo: () => void;
  closeInfo: () => void;
  infoRef: React.RefObject<HTMLDivElement>;
}

/**
 * Custom hook для управления tooltip информацией
 * Инкапсулирует логику показа/скрытия tooltip и обработки кликов вне области
 */
export function useInfoTooltip(): UseInfoTooltipReturn {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // Закрытие tooltip при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showInfo]);

  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const closeInfo = useCallback(() => {
    setShowInfo(false);
  }, []);

  return {
    showInfo,
    toggleInfo,
    closeInfo,
    infoRef
  };
}
