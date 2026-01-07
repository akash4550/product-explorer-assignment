'use client';
import useSWR from 'swr';
import { useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import CategoryPills from '@/components/CategoryPills';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const fetcher = (url: string) => fetch(`${API_BASE}${url}`).then(r => r.json());

export default function Home() {
  const { data, mutate, isValidating, error } = useSWR('/products', fetcher, {
    revalidateOnFocus: false,
  });
  
  const [filter, setFilter] = useState('All');
  const [isScraping, setIsScraping] = useState(false);

  const refresh = async () => {
    setIsScraping(true);
    try {
      // Calls the newly restored UI endpoint
      const res = await fetch(`${API_BASE}/products/trigger/scrape`);
      if (!res.ok) throw new Error('Scrape failed');
      await mutate(); 
    } catch (err) {
      alert('Failed to trigger scraper. Check backend console.');
    } finally {
      setIsScraping(false);
    }
  };

  const products = (data || []).filter((p: any) => {
    if (filter === 'All') return true;
    return (p.name || '').toLowerCase() === filter.toLowerCase();
  });

  return (
    <main className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Explorer</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view scraped inventory.
          </p>
        </div>

        <button 
          onClick={refresh} 
          disabled={isScraping || isValidating} 
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm
            ${isScraping 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'}
          `}
        >
          {isScraping ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span>Scraping...</span>
            </>
          ) : (
            'Refresh Data'
          )}
        </button>
      </header>

      <div className="mb-6">
        <CategoryPills selected={filter} onSelect={setFilter} />
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-100 rounded-lg">
          ⚠️ Failed to load products. Is the backend running?
        </div>
      )}

      <div className="transition-opacity duration-300">
        <ProductGrid 
          products={products} 
          loading={!data && !error} 
        />
      </div>
    </main>
  );
}