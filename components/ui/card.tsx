import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  primaryText: string;
  secondaryText: string;
}

export const Card: React.FC<Props> = ({
  className,
  primaryText,
  secondaryText,
}) => {
  return (
    <div className={cn(className, 'bg-background p-4 rounded-lg border')}>
      <h3 className="text-lg font-semibold text-primary mb-2">{primaryText}</h3>
      <p className="text-primary/80">{secondaryText}</p>
    </div>
  );
};
