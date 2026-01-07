import React from 'react'
import Link from 'next/link'

interface Product {
  id: string;
  product_id: string;
  title: string;
  author: string;
  price: number | string;
  image_url: string;
  name: string;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <Link 
          key={p.id || p.product_id} 
          href={`/product/${p.id || p.product_id}`} 
          className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-lg mb-4 aspect-[3/4]">
            <img 
              src={p.image_url || 'https://via.placeholder.com/300x400?text=No+Image'} 
              alt={p.title} 
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute top-2 right-2">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider text-gray-700">
                {p.name}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]" title={p.title}>
              {p.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {p.author || 'Unknown Author'}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-2">
              <span className="text-blue-600 font-bold text-lg">
                {typeof p.price === 'number' ? `£${p.price.toFixed(2)}` : 'Price N/A'}
              </span>
              <span className="text-xs text-blue-600 font-semibold group-hover:underline flex items-center">
                View Details &rarr;
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
