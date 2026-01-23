// app/products/page.js
export default function ProductsPage() {
  const products = [
    { id: 1, name: "iPhone", price: 1000 },
    { id: 2, name: "MacBook", price: 2500 },
  ];

  return (
    <div>
      <h1>All Products</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} – ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
