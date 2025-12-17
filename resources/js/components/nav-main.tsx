import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel className="text-sm font-semibold text-white">
        GamersHub Platform
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.href
            ? page.url.startsWith(resolveUrl(item.href))
            : false;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!!item.href}
                isActive={isActive}
                tooltip={{ children: item.title }}
              >
                {item.href ? (
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
