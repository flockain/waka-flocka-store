'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductCard from '../../../components/ProductCard'
import { type Product } from '../../../types/storeTypes'
import { fetchProductsByCategory } from '../../../services/productService'

export default function CategoryPage(): JSX.Element {
  const params = useParams();
  const categoryId = params?.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categoryNames: Record<string, string> = {
    merchandise: 'Merchandise',
    features: 'Song Features',
    studio: 'Studio Sessions',
    concerts: 'Concert Bookings',
  };

  const categoryTitle = categoryNames[categoryId] || 'Products';

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadProducts();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryTitle}</h1>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center">{error}</div>
        )}

        {/* Product List */}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-600">No products available in this category.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
