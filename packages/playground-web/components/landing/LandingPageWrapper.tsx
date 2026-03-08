'use client';

import { LandingPage } from './LandingPage';

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  descriptionKo?: string;
  descriptionJa?: string;
  category: string;
  thumbnail?: string;
  price?: number;
}

interface LandingPageWrapperProps {
  templates: GalleryItem[];
}

export function LandingPageWrapper({ templates }: LandingPageWrapperProps) {
  return <LandingPage templates={templates} />;
}
