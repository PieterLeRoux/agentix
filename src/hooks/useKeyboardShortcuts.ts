import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onNew?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSave,
  onUndo,
  onRedo,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onSelectAll,
  onZoomIn,
  onZoomOut,
  onNew,
  enabled = true,
}: KeyboardShortcutsOptions): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { ctrlKey, metaKey, shiftKey, key } = event;
    const isModifierPressed = ctrlKey || metaKey;

    // Prevent shortcuts when typing in inputs
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    )) {
      return;
    }

    switch (key.toLowerCase()) {
      case 's':
        if (isModifierPressed) {
          event.preventDefault();
          onSave?.();
        }
        break;

      case 'z':
        if (isModifierPressed) {
          event.preventDefault();
          if (shiftKey) {
            onRedo?.();
          } else {
            onUndo?.();
          }
        }
        break;

      case 'y':
        if (isModifierPressed) {
          event.preventDefault();
          onRedo?.();
        }
        break;

      case 'c':
        if (isModifierPressed) {
          event.preventDefault();
          onCopy?.();
        }
        break;

      case 'x':
        if (isModifierPressed) {
          event.preventDefault();
          onCut?.();
        }
        break;

      case 'v':
        if (isModifierPressed) {
          event.preventDefault();
          onPaste?.();
        }
        break;

      case 'a':
        if (isModifierPressed) {
          event.preventDefault();
          onSelectAll?.();
        }
        break;

      case 'n':
        if (isModifierPressed) {
          event.preventDefault();
          onNew?.();
        }
        break;

      case 'delete':
      case 'backspace':
        if (!isModifierPressed) {
          event.preventDefault();
          onDelete?.();
        }
        break;

      case '=':
      case '+':
        if (isModifierPressed) {
          event.preventDefault();
          onZoomIn?.();
        }
        break;

      case '-':
        if (isModifierPressed) {
          event.preventDefault();
          onZoomOut?.();
        }
        break;

      default:
        break;
    }
  }, [
    enabled,
    onSave,
    onUndo,
    onRedo,
    onCopy,
    onCut,
    onPaste,
    onDelete,
    onSelectAll,
    onZoomIn,
    onZoomOut,
    onNew,
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => {}; // Return empty cleanup function when not enabled
  }, [handleKeyDown, enabled]);
};