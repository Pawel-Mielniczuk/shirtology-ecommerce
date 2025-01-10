import { cx } from 'class-variance-authority';

import { formatCurrency } from '@/lib/utils';

export default function ProductPrice({ amount, className }) {
  return <p className={cx('text-2xl', className)}>{formatCurrency(amount)}</p>;
}
