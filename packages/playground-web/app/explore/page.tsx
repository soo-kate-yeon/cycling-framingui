/**
 * Legacy Explore Home
 *
 * `/explore` is no longer the primary landing route.
 * Keep the route for compatibility, but send users to the homepage gallery.
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Theme Gallery',
  description: 'Browse FramingUI themes from the homepage gallery.',
};

export default function ExplorePage() {
  redirect('/#theme-gallery');
}
