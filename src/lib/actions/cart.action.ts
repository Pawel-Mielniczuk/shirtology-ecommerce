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

    // parse and validate Item
    const item = cartItemSchema.parse(data);

    //Find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    if (cart) {
      // Check if item is already in the cart
      const itemExist = (cart.items as CartItem[]).find(
        x => x.productId === item.productId,
      );

      if (itemExist) {
        //check stock
        if (product.stock < itemExist.quantity + 1) {
          throw new Error('Not enough stock');
        }
        // increase quantity
        const itemIndex = cart.items.findIndex(
          x => x.productId === item.productId,
        );
        if (itemIndex !== -1) {
          cart.items[itemIndex].quantity = itemExist.quantity + 1;
        }
      } else {
        if (product.stock < 1) throw new Error('Not enough stock');

        cart.items.push(item);
      }
      console.log('aktualizacja koszuka', cart);
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${itemExist ? 'Updated in' : 'added to'} cart`,
      };
    } else {
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
        message: `${product.name} added to cart`,
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
