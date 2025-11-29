import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
  variant?: 'header' | 'sidebar';
}

export function AppHeaderContent({ variant = 'header', children, ...props }: AppContentProps) {
  if (variant === 'sidebar') {
    return <SidebarInset {...props}>{children}</SidebarInset>;
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 mx-auto w-full gap-4 rounded-xl px-4" {...props}>
      {children}
    </main>
  );
}
