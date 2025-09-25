import { cn } from '@/lib/utils';
import React from 'react';

interface PdfItem {
  className?: string;
  url: string;
  title?: string;
}

export const Pdf: React.FC<PdfItem> = ({ className, url, title }) => {
  return (
    <div className={cn(className)}>
      {title && (
        <h3 className="bg-primary/10 text-primary font-semibold p-4 text-center">
          {title}
        </h3>
      )}

      <div className="flex justify-center">
        <iframe src={url} className="w-full h-[80vh] md:h-[60vh]"></iframe>
      </div>
    </div>
  );
};
