/**
 * Components
 */
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

/**
 * Assets
 */
import { ChevronsUpDown } from 'lucide-react';

/**
 * Types
 */
import { MenuItem } from '@/types/home';
import { Separator } from '../ui/separator';
type MobileMenuProps = {
  navMenu: MenuItem[];
};

const MobileMenu = ({ navMenu }: MobileMenuProps) => {
  return (
    <div>
      <ul className="mb-3 text-sm">
        {navMenu.map(({ href, label, submenu }, index) => (
          <li key={index}>
            {submenu ? (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={'ghost'}
                    className="w-full cursor-pointer justify-between"
                  >
                    {label}

                    <ChevronsUpDown />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="ps-2">
                  <ul className="border-l border-l-muted-foreground/20">
                    {submenu.map(({ href, label }, index) => (
                      <li key={index}>
                        <Button
                          asChild
                          variant={'ghost'}
                          className="w-full justify-start text-muted-foreground hover:bg-transparent"
                        >
                          <a href={href}>{label}</a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                asChild
                variant={'ghost'}
                className="w-full justify-start p-3"
              >
                <a href={href}>{label}</a>
              </Button>
            )}
          </li>
        ))}
      </ul>

      <Separator className="bg-muted-foreground/20" />

      <div className="mt-4 flex items-center gap-2">
        <Button variant={'ghost'} className="w-full cursor-pointer">
          Sign In
        </Button>
        <Button className="w-full cursor-pointer">Free Trial</Button>
      </div>
    </div>
  );
};

export default MobileMenu;
