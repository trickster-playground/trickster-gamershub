import CustomLayoutTemplate from '@/layouts/app/customs/custom-app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <CustomLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
    {children}
  </CustomLayoutTemplate>
);
