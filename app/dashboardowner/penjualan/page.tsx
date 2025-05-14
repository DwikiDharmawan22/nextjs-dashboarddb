'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine, creepster } from '@/app/ui/fonts';
import { Transaction } from '@/app/lib/definitions2';
import { loadTransactions } from '@/app/lib/data2';

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<string>('4');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTransactions(loadTransactions());
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setTransactions(loadTransactions());
    };
    window.addEventListener('focus', handleRouteChange);
    return () => {
      window.removeEventListener('focus', handleRouteChange);
    };
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / Number(entriesPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * Number(entriesPerPage),
    currentPage * Number(entriesPerPage)
  );

  useEffect(() => {
    console.log('Entries per page:', entriesPerPage);
    console.log('Filtered transactions:', filteredTransactions.length);
    console.log('Paginated transactions:', paginatedTransactions.length);
  }, [entriesPerPage, filteredTransactions, paginatedTransactions]);

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
    <div className={`min-h-screen text-white p-4`} style={{ backgroundColor: '#6A1E55' }}>
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
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#6A1E55]">
                  Tidak ada transaksi
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t text-[#6A1E55]">
                  <td className="p-2">{transaction.id}</td>
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.totalPrice}</td>
                  <td className="p-2">{transaction.username}</td>
                  <td className="p-2">{transaction.product}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`flex flex-col items-center mt-16 ${cousine.className}`}>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            className={`bg-white text-black px-2 py-1 rounded ${cousine.className}`}
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
            className={`bg-white text-black px-2 py-1 rounded ${cousine.className}`}
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