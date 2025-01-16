'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { singInWithCredentials } from '@/lib/actions/user.action';

export function SignInForm() {
  const [data, action] = useActionState(singInWithCredentials, {
    success: false,
    message: '',
  });

  function SignInButton() {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant="default" aria-disabled={pending}>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
          />
        </div>
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have account?{' '}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
