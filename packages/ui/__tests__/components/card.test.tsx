/**
 * @framingui - Card Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../src/components/card';

describe('Card', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Card data-testid="card">Card content</Card>);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('renders all sub-components', () => {
      render(
        <Card>
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Title</CardTitle>
            <CardDescription data-testid="description">Description</CardDescription>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
          <CardFooter data-testid="footer">Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Structure', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main card content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Main card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('renders card without header', () => {
      render(
        <Card>
          <CardContent>Content only</CardContent>
        </Card>
      );
      expect(screen.getByText('Content only')).toBeInTheDocument();
    });

    it('renders card without footer', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Card data-testid="card">
          <CardTitle data-testid="title">Title</CardTitle>
          <CardDescription data-testid="description">Description</CardDescription>
        </Card>
      );

      expect(screen.getByTestId('card')).toHaveClass('bg-[var(--bg-card)]');
      expect(screen.getByTestId('card')).toHaveClass('text-[var(--bg-card-foreground)]');
      expect(screen.getByTestId('description')).toHaveClass(
        'text-[var(--bg-muted-foreground)]'
      );
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This card is accessible</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content with proper structure</p>
          </CardContent>
          <CardFooter>
            <button>Learn More</button>
          </CardFooter>
        </Card>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('supports custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    it('supports aria-label for complex cards', () => {
      render(
        <Card aria-label="Product card" data-testid="card">
          <CardContent>Product info</CardContent>
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Product card');
    });
  });
});
