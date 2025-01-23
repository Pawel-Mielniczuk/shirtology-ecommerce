import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(object: T): T {
  /* eslint-disable-next-line unicorn/prefer-structured-clone */
  return JSON.parse(JSON.stringify(object));
}

export function round2(amount: number | string) {
  if (typeof amount === 'number') {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  } else if (typeof amount === 'string') {
    return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
  } else {
    throw new TypeError('Amount is not a number or string');
  }
}

export function formatCurrency(amount: number = 0): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-US', options);

  return formatter.format(amount / 100);
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(
      field => error.errors[field].message,
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exist`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}
