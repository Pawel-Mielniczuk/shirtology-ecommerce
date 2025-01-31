import { z } from 'zod';

import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
export type shippingAddress = z.infer<typeof shippingAddressSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
