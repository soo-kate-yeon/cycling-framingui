'use client';

/**
 * AlertModal - Editorial-tech 스타일 알럿 다이얼로그
 *
 * 네이티브 alert()를 대체하는 스타일드 모달.
 * editorial-tech 테마 레시피 적용:
 * - rounded-2xl 모달 컨테이너
 * - rounded-full 필 버튼
 * - 고정 width/height (콘텐츠 비례 X)
 * - 반응형 최적화 (모바일/데스크톱)
 */

import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  variant?: AlertVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 확인 버튼만 표시 (Cancel 숨김) */
  singleAction?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_ICON: Record<AlertVariant, typeof AlertTriangle> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
};

const VARIANT_ICON_COLOR: Record<AlertVariant, string> = {
  info: 'text-neutral-600',
  warning: 'text-amber-500',
  error: 'text-red-500',
  success: 'text-emerald-500',
};

// ============================================================================
// Component
// ============================================================================

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  singleAction = true,
}: AlertModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 150);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    handleClose();
  }, [onConfirm, handleClose]);

  // Escape key
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const IconComponent = VARIANT_ICON[variant];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Overlay — editorial-tech: bg-black/80 backdrop-blur-sm */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-150 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal — editorial-tech: 고정 크기 */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-desc"
        className={`relative z-10 bg-white border border-neutral-200 rounded-2xl shadow-2xl
          w-full h-auto
          sm:w-[420px] sm:h-[240px]
          md:w-[480px] md:h-[260px]
          flex flex-col transition-all duration-150
          ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'}`}
      >
        {/* Content */}
        <div className="flex-1 flex flex-col gap-3 p-6 sm:p-8">
          {/* Icon + Title */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <IconComponent size={22} className={VARIANT_ICON_COLOR[variant]} />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <h3
                id="alert-modal-title"
                className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-950 leading-snug"
              >
                {title}
              </h3>
              <p
                id="alert-modal-desc"
                className="text-sm sm:text-base text-neutral-500 leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions — editorial-tech: rounded-full 필 버튼 */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
          {!singleAction && (
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={singleAction ? handleClose : handleConfirm}
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
