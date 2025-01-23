'use client';

import { Loader, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { Cart, CartItem } from '@/types';

import { Button } from '../ui/button';
import { ToastAction } from '../ui/toast';

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
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
    });
  }

  async function handleRemoveFromCart() {
    startTransition(async () => {
      const response = await removeItemFromCart(item.productId);

      toast({
        variant: response.success ? 'default' : 'destructive',
        description: response.message,
      });

      return;
    });
  }

  const itemExist =
    cart &&
    cart.items.find(production => production.productId === item.productId);
  const element = itemExist ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{itemExist.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );

  return element;
}
