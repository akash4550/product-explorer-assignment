import React from 'react';
import { notFound } from 'next/navigation';

interface Product {
  id: string;
  product_id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  name: string;
  details?: {
    description: string;
    specs: Record<string, any>;
  }[];
}

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.INTERNAL_API_URL || 'http://backend:3000/api';

  try {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product. Ensure the Backend is running.", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const detail = product.details && product.details.length > 0 ? product.details[0] : null;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <a href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">&larr; Back to Library</a>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
          {product.image_url ? (
             <img 
               src={product.image_url} 
               alt={product.title} 
               className="max-h-80 w-auto object-contain shadow-sm hover:scale-105 transition-transform duration-300" 
             />
          ) : (
            <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gray-200 rounded">
              No Image Available
            </div>
          )}
        </div>

        <div className="p-8 md:w-2/3 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.name || 'Book'}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-lg text-gray-500 mt-2 font-medium">by {product.author || 'Unknown Author'}</p>
            </div>
            <div className="text-3xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              ${product.price ? product.price.toFixed(2) : '0.00'}
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="prose max-w-none text-gray-700 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              📖 About this Item
            </h3>
            <p className="leading-relaxed text-gray-600 whitespace-pre-line">
              {detail?.description || 'No detailed description available yet. Trigger the scraper to populate this data.'}
            </p>
          </div>

          {detail?.specs && Object.keys(detail.specs).length > 0 && (
            <div className="mt-auto bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {Object.entries(detail.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center group">
                    <span className="font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-gray-900 text-right group-hover:text-blue-600 transition-colors">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
