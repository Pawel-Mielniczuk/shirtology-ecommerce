import { notFound } from 'next/navigation';

import AddToCart from '@/components/product/AddToCart';
import ProductImages from '@/components/product/ProductImages';
import ProductPrice from '@/components/product/ProductPrice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getMyCart } from '@/lib/actions/cart.action';
import { getProduct } from '@/lib/actions/product.action';

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const cart = await getMyCart();

  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <article>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h2 className="h2-bold">{product.name}</h2>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ProductPrice
                amount={product.price}
                className="w-24 rounded-full bg-green-100 px-5 py-2 text-green-700"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <p>Price</p>
                  <ProductPrice amount={product.price} />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Status</p>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        quantity: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </article>
  );
}
