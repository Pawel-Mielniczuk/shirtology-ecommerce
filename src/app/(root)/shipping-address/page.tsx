import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getMyCart } from '@/lib/actions/cart.action';
import { getUserById } from '@/lib/actions/user.action';
import { ShippingAddress } from '@/types';

import { auth } from '../../../../auth';
import { ShippingForm } from './shipping-form';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('No user id');
  }

  if (!session) {
    throw new Error('No session found. Please log in.');
  }

  const user = await getUserById(userId);
  return <ShippingForm address={user.address as ShippingAddress} />;
}
