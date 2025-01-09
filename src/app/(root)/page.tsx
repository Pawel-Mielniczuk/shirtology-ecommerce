import ProductsList from '@/components/product/ProductList';
import sampleData from '@/db/sample-data';

export default function Homepage() {
  const { products } = sampleData;

  return (
    <>
      <ProductsList data={products} />
    </>
  );
}
