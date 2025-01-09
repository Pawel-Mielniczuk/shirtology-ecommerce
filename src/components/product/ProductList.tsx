export default function ProductsList({ data, title }) {
  console.log({ data, title });
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
