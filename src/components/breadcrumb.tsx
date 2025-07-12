"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItem = {
  href: string;
  label: string;
  isCurrent?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-muted-foreground', className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            <Link
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground',
                item.isCurrent && 'font-medium text-foreground'
              )}
              aria-current={item.isCurrent ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
