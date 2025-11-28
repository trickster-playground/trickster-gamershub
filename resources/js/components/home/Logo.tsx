/**
 * Assets
 */

import { favicon, logo } from '@/assets';

type LogoProps = {
  variant?: 'default' | 'icon';
};

const Logo = ({ variant = 'default' }: LogoProps) => {
  return (
    <a href="/" className="w-fit">
      {variant === 'default' && (
        <img src={logo} alt="GamersHub Logo" width={200} height={200} />
      )}
      {variant === 'icon' && (
        <img src={favicon} alt="GamersHub Icon" width={50} height={50} />
      )}
    </a>
  );
};

export default Logo;
