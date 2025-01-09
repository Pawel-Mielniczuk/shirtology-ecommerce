import { cx } from 'class-variance-authority';

export default function ProductPrice({ amount, className }) {
  return <p className={cx('text-2xl', className)}>{amount}</p>;
}
