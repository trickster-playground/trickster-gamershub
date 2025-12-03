import React from 'react';

interface ProfileStatsProps {
  value: number | string;
  label: string;
  onClick?: () => void;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  value,
  label,
  onClick,
}) => {
  const isClickable = typeof onClick === 'function';

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 ${isClickable ? 'cursor-pointer transition hover:bg-dark-3' : ''} bg-dark-4`}
    >
      <p className="small-semibold lg:body-bold text-sky-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
};

export default ProfileStats;
