import ProductsList from '@/components/product/ProductList';
import { getLatestProducts } from '@/lib/actions/product.action';

export default async function Homepage() {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductsList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
}
