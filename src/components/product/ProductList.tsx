import ProductCard from './ProductCard';

export default function ProductsList({ data, title }) {
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
