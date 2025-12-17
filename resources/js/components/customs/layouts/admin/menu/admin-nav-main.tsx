import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export function AdminNavMain({ items }: { items: NavItem[] }) {
  const page = usePage();

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel className='text-sm text-white font-semibold'>Administrator Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          // ===== MENU TANPA CHILD =====
          if (!item.children) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={page.url.startsWith(resolveUrl(item.href!))}
                  tooltip={{ children: item.title }}
                >
                  <Link href={item.href!} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // ===== MENU DENGAN CHILD (COLLAPSIBLE) =====
          const isOpen = item.children.some(
            (child) =>
              child.href && page.url.startsWith(resolveUrl(child.href)),
          );

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={{ children: item.title }} className='cursor-pointer'>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((child) => (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuButton
                          asChild
                          size="default"
                          isActive={
                            !!child.href &&
                            page.url.startsWith(resolveUrl(child.href))
                          }
                        >
                          <Link href={child.href!} prefetch>
                            {child.icon && <child.icon />}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
