import { useEffect, useRef, useCallback } from 'react';

type NotificationType = 'info' | 'error' | 'warning' | 'success';

interface AutoSaveOptions {
  enabled?: boolean;
  interval?: number;
  onSave?: () => Promise<void> | void;
  hasUnsavedChanges?: boolean;
  showNotification?: (message: string, type: NotificationType) => void;
}

interface AutoSaveReturnType {
  startAutoSave: () => void;
  stopAutoSave: () => void;
  resetAutoSave: () => void;
  performAutoSave: () => Promise<void>;
  getTimeSinceLastSave: () => number;
  getNextAutoSaveIn: () => number;
  isAutoSaveEnabled: boolean;
}

export const useAutoSave = ({
  enabled = true,
  interval = 30000, // 30 seconds
  onSave,
  hasUnsavedChanges,
  showNotification,
}: AutoSaveOptions): AutoSaveReturnType => {
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTime = useRef(Date.now());

  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !onSave) return;

    try {
      await onSave();
      lastSaveTime.current = Date.now();
      showNotification?.('Auto-saved', 'info');
    } catch (error) {
      console.error('Auto-save failed:', error);
      showNotification?.('Auto-save failed', 'error');
    }
  }, [hasUnsavedChanges, onSave, showNotification]);

  const startAutoSave = useCallback(() => {
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
    }

    autoSaveInterval.current = setInterval(() => {
      performAutoSave();
    }, interval) as NodeJS.Timeout;
  }, [interval, performAutoSave]);

  const stopAutoSave = useCallback(() => {
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
      autoSaveInterval.current = null;
    }
  }, []);

  const resetAutoSave = useCallback(() => {
    lastSaveTime.current = Date.now();
    if (enabled) {
      startAutoSave();
    }
  }, [enabled, startAutoSave]);

  useEffect(() => {
    if (enabled) {
      startAutoSave();
    } else {
      stopAutoSave();
    }

    return () => {
      stopAutoSave();
    };
  }, [enabled, startAutoSave, stopAutoSave]);

  // Reset timer when changes are manually saved
  useEffect(() => {
    if (!hasUnsavedChanges) {
      lastSaveTime.current = Date.now();
    }
  }, [hasUnsavedChanges]);

  const getTimeSinceLastSave = useCallback(() => {
    return Date.now() - lastSaveTime.current;
  }, []);

  const getNextAutoSaveIn = useCallback(() => {
    const timeSinceLastSave = getTimeSinceLastSave();
    return Math.max(0, interval - timeSinceLastSave);
  }, [interval, getTimeSinceLastSave]);

  return {
    startAutoSave,
    stopAutoSave,
    resetAutoSave,
    performAutoSave,
    getTimeSinceLastSave,
    getNextAutoSaveIn,
    isAutoSaveEnabled: enabled,
  };
};