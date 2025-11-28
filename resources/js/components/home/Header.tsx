/**
 * Node Modules
 */
import { Link } from '@inertiajs/react';

/**
 * Routes
 */
import { dashboard, login, register } from '@/routes';

/**
 * Components UI
 */
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

/**
 * Components Home
 */
import Logo from './Logo';
import MobileMenu from './MobileMenu';

/**
 * Assets
 */
import { Menu } from 'lucide-react';

/**
 * Constants
 */
import { navMenu } from '@/constants';

const Header = ({
  auth,
  canRegister,
}: {
  auth: any;
  canRegister?: boolean;
}) => {
  return (
    <header className="grid h-16 grid-cols-1 items-center md:h-20 lg:h-24">
      <div className="container flex justify-between lg:grid lg:grid-cols-[1fr_3fr_1fr]">
        <Logo variant="icon" />

        <NavigationMenu className="mx-auto max-lg:hidden">
          <NavigationMenuList>
            {navMenu.map(({ href, label, submenu }, index) => (
              <NavigationMenuItem key={index}>
                {submenu ? (
                  <>
                    <NavigationMenuTrigger className="cursor-pointer">
                      {label}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                      <ul className="grid w-[640px] grid-cols-2 gap-2 p-2">
                        {submenu.map(({ href, icon, label, desc }, index) => (
                          <li key={index}>
                            <NavigationMenuLink asChild>
                              <a
                                href={href}
                                className="flex gap-3 rounded-sm p-2 transition-colors select-none hover:bg-foreground/5"
                              >
                                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-sm border-t border-foreground/5 bg-foreground/10 shadow-sm">
                                  {icon}
                                </div>

                                <div className="">
                                  <div className="mb-1 text-[13px] leading-normal">
                                    {label}
                                  </div>

                                  <p className="text-[13px] leading-normal text-muted-foreground">
                                    {desc}
                                  </p>
                                </div>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    href={href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {label}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end gap-2 max-lg:hidden">
          {auth?.user ? (
            <Link href={dashboard()}>
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href={login()}>
                <Button variant="ghost">Sign In</Button>
              </Link>

              {canRegister && (
                <Link href={register()}>
                  <Button>Sign Up</Button>
                </Link>
              )}
            </>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} size={'icon'} className="lg:hidden">
              <Menu />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="overflow-hidden rounded-lg border-x-0 border-b-0 border-foreground/5 bg-background/50 backdrop-blur-3xl"
          >
            <MobileMenu navMenu={navMenu} />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
