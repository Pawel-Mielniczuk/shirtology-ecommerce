'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';

import { auth } from '../../../auth';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';

function calcPrice(items: CartItem[]) {
  const itemsTotal = items.reduce(
    (accumulator, item) => accumulator + Number(item.price) * item.quantity,
    0,
  );

  const itemsPrice = round2(itemsTotal);
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}

export async function addItemToCart(data: CartItem) {
  try {
    //Check for cart cookie
    const cookiesInstance = await cookies();
    const sessionCardId = cookiesInstance.get('sessionCartId')?.value;

    if (!sessionCardId) {
      throw new Error('Cart session not found');
    }

    // Get session and user Id
    const session = await auth();

    const userId = session?.user?.id
      ? (session?.user?.id as string)
      : undefined;

    const cart = await getMyCart();
    console.log('cart', cart);

    // parse and validate Item
    const item = cartItemSchema.parse(data);

    //Find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    // console.log({
    //   'Session Card Id': sessionCardId,
    //   'User id': userId,
    //   'Item requested': item,
    //   'product found': product,
    // });

    if (!product) {
      throw new Error('Product not found');
    }
    if (!cart) {
      // Create a new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCardId,
        ...calcPrice([item]),
      });

      // Add to db
      await prisma.cart.create({
        data: newCart,
      });

      //revalidate product page
      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: 'Item added to cart',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const cookiesInstance = await cookies();
  const sessionCartId = cookiesInstance.get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from db

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// export async function getMyCart() {
//   // Check for cart cookie
//   const sessionCartId = (await cookies()).get('sessionCartId')?.value;
//   if (!sessionCartId) throw new Error('Cart session not found');

//   // Get session and user ID
//   const session = await auth();
//   const userId = session?.user?.id ? (session.user.id as string) : undefined;

//   // Get user cart from database
//   const cart = await prisma.cart.findFirst({
//     where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
//   });

//   console.log('cart is', cart);

//   if (!cart) return undefined;

//   // Convert decimals and return
//   return convertToPlainObject({
//     ...cart,
//     items: cart.items as CartItem[],
//     itemsPrice: cart.itemsPrice.toString(),
//     totalPrice: cart.totalPrice.toString(),
//     shippingPrice: cart.shippingPrice.toString(),
//     taxPrice: cart.taxPrice.toString(),
//   });
// }
