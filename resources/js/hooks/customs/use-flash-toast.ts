import { comicToast } from '@/components/customs/display/ui/toasts/comic-toast';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface FlashProps {
  success?: string;
  error?: string;
  info?: string;
  warning?: string;
}

interface PageProps {
  flash?: FlashProps;
  [key: string]: unknown;
}

export function useFlashToast(): void {
  const { flash } = usePage<PageProps>().props;
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!flash || hasShownRef.current) return;

    if (flash.success) comicToast.default(flash.success);
    if (flash.error) comicToast.error(flash.error);
    if (flash.info) comicToast.info(flash.info);
    if (flash.warning) comicToast.warning(flash.warning);

    hasShownRef.current = true;
  }, [flash]);
}
