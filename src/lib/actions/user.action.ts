'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { signIn, signOut } from '../../../auth';
import { signInSchema } from '../validators';

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
