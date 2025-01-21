import { z } from 'zod';

export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must be at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z.number(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'COnfirm password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.number().min(1, 'Name is required'),
  quantity: z.number().int().nonnegative('Quantity must be positive number'),
  image: z.string().min(1, 'Image is required'),
  price: z.number(),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: z.number(),
  totalPrice: z.number(),
  shippingPrice: z.number(),
  taxPrice: z.number(),
  sessionCardId: z.string().min(1, 'SessionCardId is required'),
  userId: z.string().optional().nullable(),
});
