'use client';
import { APP_TITLE } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        alt={`${APP_TITLE} logo`}
      />
      <div className="w-1/3 rounded-lg p-6 text-center shadow-md">
        <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
        <p className="text-destructive">Could not find requested page</p>
        <Button
          variant="outline"
          className="ml-2 mt-4"
          onClick={() => (window.location.href = '/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
