/**
 * @framingui/ui - Card Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Card component
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders Card without crashing', () => {
      const { container } = render(<Card>Card Content</Card>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders all card sub-components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });

    it('renders Card with custom children', () => {
      render(<Card data-testid="card">Custom Content</Card>);
      expect(screen.getByTestId('card')).toHaveTextContent('Custom Content');
    });
  });

  // 2. Sub-component Tests
  describe('Sub-components', () => {
    it('renders CardHeader independently', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.firstChild).toHaveTextContent('Header');
    });

    it('renders CardTitle as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('renders CardDescription as p element', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('P');
    });

    it('renders CardContent independently', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild).toHaveTextContent('Content');
    });

    it('renders CardFooter independently', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveTextContent('Footer');
    });
  });

  // 3. Composition Tests
  describe('Composition', () => {
    it('supports complex nested structures', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>Product details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Price: $99</p>
            <p>Stock: 10 items</p>
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('Price: $99')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
    });

    it('handles optional sub-components', () => {
      render(
        <Card>
          <CardTitle>Title Only</CardTitle>
          <CardContent>Content Only</CardContent>
        </Card>
      );

      expect(screen.getByText('Title Only')).toBeInTheDocument();
      expect(screen.getByText('Content Only')).toBeInTheDocument();
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This is accessible</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports ARIA attributes', () => {
      render(
        <Card aria-label="Product card" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', 'Product card');
    });

    it('maintains semantic heading hierarchy', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Main Title</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText('Main Title');
      expect(title.tagName).toBe('H3');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles to Card', () => {
      const { container } = render(<Card>Test</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/var\(--/);
    });

    it('uses Tekton spacing tokens in CardHeader', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('p-[var(--spacing-6)]');
    });

    it('uses Tekton spacing tokens in CardContent', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content.className).toContain('p-[var(--spacing-6)]');
    });

    it('uses Tekton radius tokens', () => {
      const { container } = render(<Card>Radius</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('rounded-[var(--radius-lg)]');
    });

    it('uses Tekton border tokens', () => {
      const { container } = render(<Card>Border</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border-[var(--border-default)]');
    });

    it('uses Tekton color tokens', () => {
      const { container } = render(<Card>Colors</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('bg-[var(--bg-card)]');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className on all sub-components', () => {
      const { container } = render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-desc">Desc</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      );

      expect(container.querySelector('.custom-card')).toBeInTheDocument();
      expect(container.querySelector('.custom-header')).toBeInTheDocument();
      expect(container.querySelector('.custom-title')).toBeInTheDocument();
      expect(container.querySelector('.custom-desc')).toBeInTheDocument();
      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container.querySelector('.custom-footer')).toBeInTheDocument();
    });

    it('forwards ref to Card', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref}>Ref Test</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
