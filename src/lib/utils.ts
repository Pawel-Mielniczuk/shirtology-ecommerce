import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(object: T): T {
  /* eslint-disable-next-line unicorn/prefer-structured-clone */
  return JSON.parse(JSON.stringify(object));
}
