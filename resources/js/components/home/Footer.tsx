/**
 * Components Home
 */
import Logo from './Logo';

/**
 * Constants
 */
import { footerData } from '@/constants';

const Footer = () => {
  return (
    <footer className="section !pb-0">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 lg:grid-cols-4">
          <Logo />

          <div className="grid grid-cols-2 gap-x-2 gap-y-8 text-sm sm:grid-cols-4 lg:col-span-3">
            {footerData.links.map(({ title, items }, index) => (
              <ul key={index} className="">
                <p className="mb-4">{title}</p>
                {items.map(({ href, label }, index) => (
                  <li key={index} className="text-muted-foreground">
                    <a
                      href={href}
                      className="inline-block py-1 transition-colors hover:text-primary"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-between border-t border-gray-600/10 py-6">
          <a
            href="https://andimuhammad.vercel.app/"
            target="_blank"
            className=""
          >
            {footerData.copyright}
          </a>

          <div className="social-wrapper">
            <ul className="flex gap-5">
              {footerData.socialLinks.map(({ href, icon }, index) => (
                <li key={index}>
                  <a href={href} target="_blank">
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
