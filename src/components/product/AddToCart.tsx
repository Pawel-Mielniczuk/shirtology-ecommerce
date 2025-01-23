'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { addItemToCart } from '@/lib/actions/cart.action';
import { CartItem } from '@/types';

import { Button } from '../ui/button';
import { ToastAction } from '../ui/toast';

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleAddToCart() {
    const response = await addItemToCart(item);

    if (!response.success) {
      toast({
        variant: 'destructive',
        description: response.message,
      });
      return;
    }

    toast({
      description: response.message,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="go to cart"
          onClick={() => router.push('/cart')}
        >
          Go to Cart
        </ToastAction>
      ),
    });
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
}
