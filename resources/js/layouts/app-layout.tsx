/**
 * Node Modules
 */
import { type ReactNode } from 'react';

/**
 * Components
 */
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';

/**
 * Types
 */
import { type BreadcrumbItem } from '@/types';

/**
 * Hooks
 */
import { useFlashToast } from '@/hooks/customs/use-flash-toast';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
  children,
  breadcrumbs,
  ...props
}: AppLayoutProps) {
  useFlashToast();

  return (
    <>
      <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppLayoutTemplate>

      <Toaster position="top-center" />
    </>
  );
}
