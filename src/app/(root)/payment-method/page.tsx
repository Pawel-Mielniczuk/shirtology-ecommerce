import { Metadata } from 'next';

import { CheckoutStep } from '@/components/checkout-step/checkout-step';
import { getUserById } from '@/lib/actions/user.action';

import { auth } from '../../../../auth';
import { PaymentMethodForm } from './payment-method-form';

export const metadata: Metadata = {
  title: 'Select payment method',
};

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('user not found');
  }

  const user = await getUserById(userId);
  return (
    <>
      <CheckoutStep current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}
