'use client';

import { Loader, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';

export function CartTable({ cart }: { cart?: Cart }) {
  // const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransiton] = useTransition();
  return (
    <>
      <h2 className="h2-bold py-4">Shopping Cart</h2>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map(item => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransiton(async () => {
                            const response = await removeItemFromCart(
                              item.productId,
                            );

                            if (!response.success) {
                              toast({
                                variant: 'destructive',
                                description: response.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus />
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransiton(async () => {
                            const response = await addItemToCart(item);

                            if (!response.success) {
                              toast({
                                variant: 'destructive',
                                description: response.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
