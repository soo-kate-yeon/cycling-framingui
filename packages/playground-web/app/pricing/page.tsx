import type { Metadata } from 'next';
import { PricingPage } from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing | FramingUI',
  description: 'Explore FramingUI plans, UI workflow tools, theme previews, and usage visibility.',
};

export default function Page() {
  return <PricingPage />;
}
