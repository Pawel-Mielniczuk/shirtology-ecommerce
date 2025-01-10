import { cx } from 'class-variance-authority';

import { formatCurrency } from '@/lib/utils';

type ProductPriceProps = {
  amount: number;
  className?: string;
};

export default function ProductPrice({ amount, className }: ProductPriceProps) {
  return <p className={cx('text-2xl', className)}>{formatCurrency(amount)}</p>;
}
