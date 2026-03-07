/**
 * @framingui/ui - Table Component Tests
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../table';

describe('Table', () => {
  const renderTable = () =>
    render(
      <Table>
        <TableCaption>Test table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderTable();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders all sub-components', () => {
      renderTable();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Test table')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('has proper table structure', () => {
      renderTable();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(2);
      expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    });

    it('renders TableCaption', () => {
      renderTable();
      expect(screen.getByText('Test table')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      render(
        <Table className="custom-table" data-testid="table">
          <tbody />
        </Table>
      );
      const table = screen.getByTestId('table');
      expect(table.className).toContain('custom-table');
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = renderTable();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton spacing tokens in TableHead', () => {
      renderTable();
      const header = screen.getByText('Name');
      expect(header.className).toContain('px-[var(--spacing-4)]');
    });

    it('uses Tekton border tokens in TableRow', () => {
      const { container } = renderTable();
      const row = container.querySelector('tbody tr');
      expect(row?.className).toContain('border-[var(--border-default)]');
    });
  });
});
