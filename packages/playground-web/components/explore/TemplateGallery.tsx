/**
 * Template Gallery Component
 * [SPEC-UI-003][TAG-UI003-046]
 *
 * 템플릿 그리드 레이아웃 갤러리 (i18n 지원)
 * - 클라이언트 사이드 selection mode state 관리
 * - ExplorePageHeader + SelectionTopBar 내부 렌더링
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateCard } from './TemplateCard';
import { SelectionTopBar } from './SelectionTopBar';
import { TemplateModal } from './TemplateModal';
import { getTemplateData } from '../../data/templates';
import { useExploreLanguage } from '../../contexts/ExploreLanguageContext';
import { getExploreContent } from '../../data/i18n/explore';

// ============================================================================
// Types
// ============================================================================

interface Template {
  id: string;
  name: string;
  description: string;
  descriptionKo?: string;
  descriptionJa?: string;
  thumbnail?: string;
  category: string;
  price?: number;
}

interface TemplateGalleryProps {
  /** 템플릿 목록 */
  templates: Template[];
  /** 추가 className */
  className?: string;
  /** 선택 모드 (double 패키지) - 서버 prop 초기값 */
  selectionMode?: 'double';
}

// ============================================================================
// Component
// ============================================================================

export function TemplateGallery({
  templates,
  className = '',
  selectionMode,
}: TemplateGalleryProps) {
  const router = useRouter();
  const { locale } = useExploreLanguage();
  const i18n = getExploreContent(locale);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 클라이언트 사이드 selection mode state (서버 prop을 초기값으로 사용)
  const [internalSelectionMode, setInternalSelectionMode] = useState(selectionMode);

  // Modal State
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const maxSelection = internalSelectionMode === 'double' ? 2 : 0;
  const isSelectionMode = !!internalSelectionMode;

  // 모달에서 "Get 2 templates" 클릭 시 selection mode 진입
  const handleEnterSelectionMode = () => {
    setActiveModalId(null); // 모달 닫기
    setInternalSelectionMode('double');
    setSelectedIds([]); // 선택 초기화
    router.replace('/explore?plan=double', { scroll: false }); // URL 동기화
  };

  // selection mode 해제
  const handleExitSelectionMode = () => {
    setInternalSelectionMode(undefined);
    setSelectedIds([]);
    router.replace('/explore', { scroll: false }); // URL 정리
  };

  // 선택 모드: 카드 클릭 = 선택/해제 토글
  const handleCardClick = (templateId: string) => {
    if (!isSelectionMode) {
      // route 대신 모달 띄우기
      setActiveModalId(templateId);
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      }
      if (prev.length >= maxSelection) {
        return prev;
      }
      return [...prev, templateId];
    });
  };

  if (templates.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          fontSize: 'var(--tekton-font-size-base, 16px)',
          color: 'var(--tekton-text-muted-foreground, #6b7280)',
        }}
      >
        {i18n.gallery.noTemplates}
      </div>
    );
  }

  // 선택된 템플릿 이름 목록
  const selectedNames = selectedIds
    .map((id) => templates.find((tmpl) => tmpl.id === id)?.name)
    .filter(Boolean) as string[];

  // Modal Data
  const activeTemplateData = activeModalId ? getTemplateData(activeModalId) : null;

  return (
    <>
      {/* Selection mode: 상단 sticky 바 */}
      {isSelectionMode && (
        <SelectionTopBar
          selectedTemplates={selectedIds}
          selectedNames={selectedNames}
          maxSelection={maxSelection}
          onExit={handleExitSelectionMode}
        />
      )}

      {/* Header - selection mode에 따라 반응 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 md:pb-16">
        {/* Template Grid */}
        <div className="mt-6 flex flex-col">
          <div
            className={`template-gallery grid grid-cols-1 sm:grid-cols-2 gap-6 p-0 ${className}`}
          >
            {templates.map((template) => {
              const isSelected = selectedIds.includes(template.id);
              const selectionDisabled = !isSelected && selectedIds.length >= maxSelection;

              return (
                <TemplateCard
                  key={template.id}
                  id={template.id}
                  name={template.name}
                  description={template.description}
                  descriptionKo={template.descriptionKo}
                  descriptionJa={template.descriptionJa}
                  thumbnail={template.thumbnail}
                  category={template.category}
                  price={template.price}
                  onClick={() => handleCardClick(template.id)}
                  selectionMode={isSelectionMode}
                  isSelected={isSelected}
                  selectionDisabled={selectionDisabled}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 모달 렌더링 */}
      {activeTemplateData && (
        <TemplateModal
          template={activeTemplateData}
          isOpen={!!activeModalId}
          onClose={() => setActiveModalId(null)}
          onSelectDouble={handleEnterSelectionMode}
        />
      )}
    </>
  );
}
