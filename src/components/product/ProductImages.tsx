'use client';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

export default function ProductImages({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = React.useState<number>(0);

  function handleSelectImage(index: number): void {
    setCurrentImage(index);
  }

  return (
    <div className="space-y-4">
      <Image
        src={images[currentImage]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div key={image}>
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              onClick={() => handleSelectImage(index)}
              className={cn(
                'mr-2 cursor-pointer border hover:border-orange-600',
                currentImage === index && 'border-orange-500',
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
