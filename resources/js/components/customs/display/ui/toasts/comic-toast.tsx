'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  Swords,
  TriangleAlertIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export const comicToast = {
  success(message: string) {
    toast.custom(
      (id) => (
        <div
          className="comic-base comic-green w-full max-w-lg min-w-md"
          onClick={() => toast.dismiss(id)}
        >
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <CircleCheckIcon className="size-5 text-white group-hover:text-[#007f5f]" />
            <span className="text-md text-nowrap">{message}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );
  },

  error(message: string) {
    toast.custom(
      (id) => (
        <div
          className="comic-base comic-red w-full max-w-lg min-w-md"
          onClick={() => toast.dismiss(id)}
        >
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <OctagonXIcon className="size-5 text-white group-hover:text-[#b91c1c]" />
            <span className="text-md text-nowrap">{message}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );
  },

  info(message: string) {
    toast.custom(
      (id) => (
        <div
          className="comic-base comic-dark w-full max-w-lg min-w-md"
          onClick={() => toast.dismiss(id)}
        >
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <InfoIcon className="size-5 text-white group-hover:text-[#0f172a]" />
            <span className="text-md text-nowrap">{message}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );
  },

  warning(message: string) {
    toast.custom(
      (id) => (
        <div
          className="comic-base comic-yellow w-full max-w-lg min-w-md"
          onClick={() => toast.dismiss(id)}
        >
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <TriangleAlertIcon className="size-5 text-white group-hover:text-[#d97706]" />
            <span className="text-md text-nowrap">{message}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );
  },

  default(message: string) {
    toast.custom(
      (id) => (
        <div
          className="comic-base comic-blue w-full max-w-lg min-w-md"
          onClick={() => toast.dismiss(id)}
        >
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <Swords className="size-5 text-white group-hover:text-[#0051ff]" />
            <span className="text-md text-nowrap">{message}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );
  },

  promise<T>(
    action: () => Promise<T>,
    messages: {
      loading: string;
      success: (data: T) => string;
      error: string;
    },
  ) {
    const id = toast.custom(
      () => (
        <div className="comic-base comic-purple w-full max-w-lg min-w-md">
          <div className="group flex w-full items-center justify-center gap-3 p-2">
            <Loader2Icon className="size-5 animate-spin text-white" />
            <span className="text-md text-nowrap">{messages.loading}</span>
          </div>
        </div>
      ),
      { unstyled: true },
    );

    action()
      .then((data) => {
        toast.custom(
          () => (
            <div
              className="comic-base comic-green w-full max-w-lg min-w-md"
              onClick={() => toast.dismiss(id)}
            >
              <div className="group flex w-full items-center justify-center gap-3 p-2">
                <CircleCheckIcon className="size-5 text-white group-hover:text-[#007f5f]" />
                <span className="text-md text-nowrap">
                  {messages.success(data)}
                </span>
              </div>
            </div>
          ),
          { id, unstyled: true },
        );
      })
      .catch(() => {
        toast.custom(
          () => (
            <div
              className="comic-base comic-red w-full max-w-lg min-w-md"
              onClick={() => toast.dismiss(id)}
            >
              <div className="group flex w-full items-center justify-center gap-3 p-2">
                <OctagonXIcon className="size-5 text-white group-hover:text-[#b91c1c]" />
                <span className="text-md text-nowrap">{messages.error}</span>
              </div>
            </div>
          ),
          { id, unstyled: true },
        );
      });
  },
};
