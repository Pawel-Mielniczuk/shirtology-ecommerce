'use server';

import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { prisma } from '@/db/prisma';
import { ShippingAddress } from '@/types';

import { auth, signIn, signOut } from '../../../auth';
import { formatError } from '../utils';
import {
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
} from '../validators';

type SignInResult = {
  success: boolean;
  message: string;
};

export async function singInWithCredentials(
  previousState: unknown,
  formData: FormData,
): Promise<SignInResult> {
  try {
    const user = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid message or password' };
  }
}

export async function singOutUser() {
  await signOut();
}

export async function signUpUser(previousState: unknown, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('user not found');

    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: address,
    });

    return { success: true, message: 'User updates successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
