'use client';

import { ArrowRight, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

import { QuantityButton } from './quantity-button';

export function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
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
                      <QuantityButton
                        isPending={isPending}
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
                        isAddButton={false}
                      />
                      <span>{item.quantity}</span>
                      <QuantityButton
                        isPending={isPending}
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
                        isAddButton={true}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="gap-4 p-4">
              <div className="pb-4 text-xl">
                Subtotal (
                {cart.items.reduce(
                  (accumulator, item) => accumulator + item.quantity,
                  0,
                )}
                ):
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}{' '}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
