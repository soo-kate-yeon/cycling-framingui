/**
 * @framingui - Table Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../../src/components/table';

describe('Table', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <Table data-testid="table">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('renders complete table structure', () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Header 1</TableHead>
              <TableHead>Header 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer 1</TableCell>
              <TableCell>Footer 2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Table Caption')).toBeInTheDocument();
      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Header 2')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 2')).toBeInTheDocument();
      expect(screen.getByText('Footer 1')).toBeInTheDocument();
      expect(screen.getByText('Footer 2')).toBeInTheDocument();
    });
  });

  describe('Table Structure', () => {
    it('renders multiple rows', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3, Cell 1</TableCell>
              <TableCell>Row 3, Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('Row 1, Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Row 2, Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Row 3, Cell 1')).toBeInTheDocument();
    });

    it('renders table with headers and body', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  describe('Table Caption', () => {
    it('renders caption', () => {
      render(
        <Table>
          <TableCaption>List of users</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText('List of users')).toBeInTheDocument();
    });
  });

  describe('Table Footer', () => {
    it('renders footer', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>100</TableCell>
              <TableCell>200</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>300</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
    });
  });

  describe('Row States', () => {
    it('supports row selection state', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-state="selected" data-testid="row">
              <TableCell>Selected Row</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('row')).toHaveAttribute('data-state', 'selected');
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Table data-testid="table">
          <TableHeader data-testid="header">
            <TableRow data-testid="row">
              <TableHead data-testid="head">Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter data-testid="footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
          <TableCaption data-testid="caption">Caption</TableCaption>
        </Table>
      );

      expect(screen.getByTestId('head')).toHaveClass('text-[var(--bg-muted-foreground)]');
      expect(screen.getByTestId('footer').className).toContain('bg-[var(--bg-muted)]');
      expect(screen.getByTestId('caption')).toHaveClass('text-[var(--bg-muted-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Table>
          <TableCaption>Employee Information</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Engineering</TableCell>
              <TableCell>$100,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Marketing</TableCell>
              <TableCell>$90,000</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Employees</TableCell>
              <TableCell>2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('uses proper table semantics', () => {
      const { container } = render(
        <Table data-testid="table">
          <TableHeader data-testid="thead">
            <TableRow>
              <TableHead data-testid="th">Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-testid="tbody">
            <TableRow data-testid="tr">
              <TableCell data-testid="td">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(screen.getByTestId('thead').tagName).toBe('THEAD');
      expect(screen.getByTestId('tbody').tagName).toBe('TBODY');
      expect(screen.getByTestId('tr').tagName).toBe('TR');
      expect(screen.getByTestId('th').tagName).toBe('TH');
      expect(screen.getByTestId('td').tagName).toBe('TD');
    });

    it('supports colSpan and rowSpan', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} data-testid="colspan">
                Spanning 2 columns
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowSpan={2} data-testid="rowspan">
                Spanning 2 rows
              </TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByTestId('colspan')).toHaveAttribute('colspan', '2');
      expect(screen.getByTestId('rowspan')).toHaveAttribute('rowspan', '2');
    });

    it('supports custom className', () => {
      render(
        <Table className="custom-table" data-testid="table">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table')).toHaveClass('custom-table');
    });
  });
});
