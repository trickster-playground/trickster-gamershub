/**
 * Node Modules
 */
import { type ReactNode } from 'react';

/**
 * Components
 */
import { Toaster } from '@/components/ui/sonner';
import CustomLayoutTemplate from '@/layouts/app/customs/custom-app-header-layout';

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

export default function CustomAppLayout({
  children,
  breadcrumbs,
  ...props
}: AppLayoutProps) {
  useFlashToast();

  return (
    <>
      <CustomLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
      </CustomLayoutTemplate>

      <Toaster position="top-center" />
    </>
  );
}
