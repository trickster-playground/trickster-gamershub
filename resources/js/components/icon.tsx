import { cn } from '@/lib/utils';
import { ElementType } from 'react';

interface IconProps {
  iconNode: ElementType;
  className?: string;
}

export function Icon({ iconNode: IconNode, className }: IconProps) {
  return <IconNode className={cn(className)} />;
}
