'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';
import { Transaction } from '@/app/lib/definitions2';
import Cards from '@/app/ui/dashboard/cards2';
import Skeleton from '@/app/ui/skeletons2';

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<string>('4');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('[loadData] Fetching transactions');
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        console.log(`[loadData] Fetched ${data.length} transactions`, data.map((t: Transaction) => t.id));
        setTransactions(data);
      } catch (error) {
        console.error('[loadData] Failed to load transactions:', error);
        alert('Failed to load transactions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const loadData = async () => {
        try {
          setIsLoading(true);
          console.log('[handleRouteChange] Refreshing transactions');
          const response = await fetch('/api/transactions');
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          const data = await response.json();
          console.log(`[handleRouteChange] Refreshed ${data.length} transactions`, data.map((t: Transaction) => t.id));
          setTransactions(data);
        } catch (error) {
          console.error('[handleRouteChange] Failed to refresh transactions:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    };
    window.addEventListener('focus', handleRouteChange);
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, []);

  const handleDelete = async (transactionId: string) => {
    console.log(`[handleDelete] Received transaction ID: "${transactionId}" (type: ${typeof transactionId})`);
    console.log(`[handleDelete] Sending DELETE request to: /api/transactions?id=${encodeURIComponent(transactionId)}`);
    if (!confirm('Are you sure you want to delete this transaction?')) {
      console.log('[handleDelete] Deletion cancelled by user');
      return;
    }

    if (!transactionId || transactionId.trim() === '') {
      console.error('[handleDelete] Invalid transaction ID:', transactionId);
      alert('Transaction ID is invalid. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/transactions?id=${encodeURIComponent(transactionId)}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      console.log(`[handleDelete] DELETE response:`, { status: response.status, data: responseData });

      if (response.ok) {
        const updatedTransactions = transactions.filter((t: Transaction) => t.id !== transactionId);
        console.log(`[handleDelete] Updated transactions: ${updatedTransactions.length} remaining`);
        setTransactions(updatedTransactions);

        const filteredTransactions = updatedTransactions.filter(
          (t: Transaction) =>
            t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.product.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const totalPages = Math.ceil(filteredTransactions.length / Number(entriesPerPage));
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        } else if (filteredTransactions.length === 0) {
          setCurrentPage(1);
        }
        alert('Transaction deleted successfully');
      } else {
        console.error('[handleDelete] Failed to delete transaction:', responseData);
        alert(`Failed to delete transaction: ${responseData.message || 'Unknown server error'}`);
      }
    } catch (error) {
      console.error('[handleDelete] Error deleting transaction:', error);
      alert('Failed to delete transaction due to network or server issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / Number(entriesPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * Number(entriesPerPage),
    currentPage * Number(entriesPerPage)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#6A1E55] text-white p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white p-4" style={{ backgroundColor: '#6A1E55' }}>
      <div>
        <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
          TRANSAKSI PENJUALAN
        </h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className={`flex items-center gap-2 text-xl ${cousine.className}`}>
          <span>SHOW:</span>
          <select
            className={`bg-white text-[#6A1E55] px-3 py-1 rounded pr-8 ${cousine.className}`}
            onChange={handleEntriesChange}
            value={entriesPerPage}
          >
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari..."
            className={`px-2 py-1 rounded text-xl text-black ${cousine.className}`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            type="button"
            className={`bg-[#A64D79] text-xl text-white px-4 py-1 rounded ${cousine.className}`}
            onClick={() => router.push('/dashboardowner/penjualan/tambah')}
          >
            TAMBAHKAN PENJUALAN
          </button>
        </div>
      </div>

      <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE1F9]">
              <th className="p-4 text-left text-3xl text-[#6A1E55]">ID TRANSAKSI</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">TGL TRANSAKSI</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">TOTAL HARGA</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">USERNAME</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">NAMA PRODUK</th>
              <th className="p-4 text-left text-3xl text-[#6A1E55]">AKSI</th>
            </tr>
          </thead>
          <Cards
            type="transaction"
            transactions={paginatedTransactions}
            loading={isLoading}
            onDelete={handleDelete}
          />
        </table>
      </div>

      {isLoading ? (
        <Skeleton type="pagination" />
      ) : (
        <div className={`flex flex-col items-center mt-16 ${cousine.className}`}>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className} ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${
                  currentPage === page ? 'bg-[#A64D79] text-white' : 'bg-white text-black'
                } px-2 py-1 rounded ${cousine.className}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className={`bg-white text-black px-2 py-1 rounded ${cousine.className} ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
          <span>
            SHOWING {(currentPage - 1) * Number(entriesPerPage) + 1} TO{' '}
            {Math.min(currentPage * Number(entriesPerPage), filteredTransactions.length)} OF{' '}
            {filteredTransactions.length} RESULTS
          </span>
        </div>
      )}

      <button
        type="button"
        className={`mt-4 bg-white text-red-700 font-bold px-4 py-2 rounded ${cousine.className}`}
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}