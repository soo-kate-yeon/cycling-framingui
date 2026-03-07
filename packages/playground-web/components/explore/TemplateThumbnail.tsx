'use client';

import { motion } from 'framer-motion';
import { getThemeThumbnailVars } from '../../lib/theme-thumbnail-resolver';

interface TemplateThumbnailProps {
  templateId: string;
}

export function TemplateThumbnail({ templateId }: TemplateThumbnailProps) {
  // Synchronously get pre-resolved theme variables (no fetch, no useEffect)
  const vars = getThemeThumbnailVars(templateId) ?? {};

  return (
    <div
      style={vars as React.CSSProperties}
      className="relative w-full h-full min-h-[260px] lg:min-h-0 aspect-[1440/900] overflow-hidden group bg-[var(--bg-canvas)] flex items-center justify-center perspective-[2000px]"
    >
      {/* Container for 3D Transform */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center transform-style-3d origin-center"
        initial={{ rotateX: 20, rotateY: -25, rotateZ: 5, scale: 0.75 }}
        whileHover={{ rotateX: 10, rotateY: -15, rotateZ: 2, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Main Dashboard Canvas */}
        <div className="absolute w-[110%] md:w-[600px] aspect-[1440/900] bg-[var(--bg-surface)] rounded-[var(--radius-lg,12px)] border border-[var(--border-default)] shadow-2xl shadow-black/10 overflow-hidden flex flex-col pointer-events-none">
          {/* Header */}
          <div className="h-10 md:h-12 border-b border-[var(--border-default)] flex items-center px-4 gap-4 bg-[var(--bg-surface)]">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded flex-shrink-0 bg-[var(--action-primary)]" />
            <div className="h-3 md:h-4 w-20 md:w-24 bg-[var(--text-tertiary)] opacity-20 rounded-full" />
            <div className="ml-auto w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)]" />
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-12 md:w-48 border-r border-[var(--border-default)] p-3 md:p-4 flex flex-col gap-3 bg-[var(--bg-canvas)]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-6 md:h-8 rounded-[var(--radius-sm,4px)] flex-shrink-0 ${
                    i === 1
                      ? 'bg-[var(--bg-secondary)] border border-[var(--border-default)]'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-[var(--bg-canvas)]">
              <div className="h-6 md:h-8 w-1/3 bg-[var(--text-primary)] opacity-10 rounded-[var(--radius-sm,4px)]" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 md:h-24 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md,8px)] p-3 flex flex-col gap-2"
                  >
                    <div className="h-3 w-1/2 bg-[var(--text-tertiary)] opacity-30 rounded-full" />
                    <div className="h-4 md:h-6 w-3/4 bg-[var(--text-primary)] opacity-80 rounded-[var(--radius-sm,4px)] mt-auto" />
                  </div>
                ))}
              </div>

              <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg,12px)] p-3 md:p-4 flex flex-col gap-3">
                <div className="h-3 md:h-4 w-1/4 bg-[var(--text-tertiary)] opacity-30 rounded-full mb-2" />
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 md:h-8 w-full border-b border-[var(--border-default)] flex items-center px-2"
                  >
                    <div className="h-2 md:h-3 w-1/2 bg-[var(--text-secondary)] opacity-40 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card 1 (Top Left Overlay) */}
        <motion.div
          className="absolute top-[10%] -left-[15%] md:-left-[10%] w-36 md:w-48 p-3 md:p-4 bg-[var(--bg-surface)] rounded-[var(--radius-lg,12px)] border border-[var(--border-default)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-3 pointer-events-none"
          initial={{ z: 40 }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--action-primary)] opacity-20" />
            <div className="flex-1 h-2 md:h-3 bg-[var(--text-primary)] opacity-50 rounded-full" />
          </div>
          <div className="w-full h-1.5 md:h-2 bg-[var(--border-default)] rounded-full overflow-hidden mt-1 md:mt-2">
            <div className="w-3/4 h-full bg-[var(--action-primary)]" />
          </div>
        </motion.div>

        {/* Floating Card 2 (Bottom Right Overlay) */}
        <motion.div
          className="absolute bottom-[5%] -right-[15%] md:-right-[5%] w-40 md:w-56 p-4 md:p-5 bg-[var(--bg-surface)] rounded-[var(--radius-xl,16px)] border border-[var(--border-emphasis)] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.3)] flex flex-col gap-3 md:gap-4 pointer-events-none"
          initial={{ z: 60 }}
        >
          <div className="h-4 md:h-5 w-2/3 bg-[var(--text-primary)] opacity-90 rounded-[var(--radius-sm,4px)]" />
          <div className="h-2 md:h-3 w-full bg-[var(--text-tertiary)] opacity-30 rounded-full" />
          <div className="h-2 md:h-3 w-4/5 bg-[var(--text-tertiary)] opacity-30 rounded-full" />

          <div className="mt-1 md:mt-2 flex gap-2">
            <div className="h-6 md:h-8 flex-1 bg-[var(--action-primary)] text-[var(--action-primary-text)] rounded-[var(--radius-md,8px)] flex items-center justify-center text-[8px] md:text-[10px] font-bold">
              Confirm
            </div>
            <div className="h-6 md:h-8 flex-[0.5] bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[var(--radius-md,8px)] text-[var(--text-secondary)] flex items-center justify-center text-[8px] md:text-[10px] font-bold">
              Cancel
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
