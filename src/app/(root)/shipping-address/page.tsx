import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getMyCart } from '@/lib/actions/cart.action';

import { auth } from '../../../../auth';
// import { shippingAddress } from '@/types';
// import { getUserById } from '@/lib/actions/user.action';

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

  // const user = await getUserById(userId);

  if (!session) {
    throw new Error('No session found. Please log in.');
  }

  // const user = await getUser(session);
  return <>Shipping Address</>;
}
