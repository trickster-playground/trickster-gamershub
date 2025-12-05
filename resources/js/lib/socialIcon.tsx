import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconWorld,
} from '@tabler/icons-react';
import React from 'react';

export const socialIconMap: Record<string, React.ReactNode> = {
  instagram: <IconBrandInstagram className="size-full text-neutral-300" />,
  youtube: <IconBrandYoutube className="size-full text-neutral-300" />,
  facebook: <IconBrandFacebook className="size-full text-neutral-300" />,
  twitter: <IconBrandX className="size-full text-neutral-300" />,
  github: <IconBrandGithub className="size-full text-neutral-300" />,
  website: <IconWorld className="size-full text-neutral-300" />,
  linkedin: <IconBrandLinkedin className="size-full text-neutral-300" />,
};
