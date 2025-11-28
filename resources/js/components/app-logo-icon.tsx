/**
 * Assets
 */
import { favicon, logo } from '@/assets';

type AppLogoIconProps = {
  variant?: 'default' | 'icon';
  className?: string;
};

export default function AppLogoIcon({
  variant = 'default',
  className = '',
}: AppLogoIconProps) {
  return (
    <>
      {variant === 'default' && (
        <img src={logo} alt="GamersHub Logo" width={200} height={200} />
      )}
      {variant === 'icon' && (
        <img src={favicon} alt="GamersHub Icon" width={50} height={50} />
      )}
    </>
  );
}
