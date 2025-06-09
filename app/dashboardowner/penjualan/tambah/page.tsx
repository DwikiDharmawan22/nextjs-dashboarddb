'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine } from '@/app/ui/fonts';
import { FormData2, Product, Transaction, AvailableProduct } from '@/app/lib/definitions2';
import Select from 'react-select';

export default function AddSalesPage() {
  const router = useRouter();

  // Fungsi untuk memformat tanggal saat ini ke format DD/MM/YYYY
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).split('/').join('/');
  };

  const [formData, setFormData] = useState<FormData2>({
    date: getCurrentDate(),
    cashier: 'Nama Pegawai',
    customer: '',
    products: [],
    discount: 0,
    totalPayment: 0,
    paymentAmount: 0,
    change: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product>({
    name: '',
    quantity: 1,
    price: 0,
    subtotal: 0,
  });
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formattedPayment, setFormattedPayment] = useState<string>('');
  const [formattedDiscount, setFormattedDiscount] = useState<string>('');

  // Daftar pelanggan untuk react-select
  const customers = [
    { value: 'Paijo', label: 'Paijo' },
    { value: 'Budi', label: 'Budi' },
    { value: 'Siti', label: 'Siti' },
    { value: 'Rina', label: 'Rina' },
    { value: 'Andi', label: 'Andi' },
    { value: 'Dewi', label: 'Dewi' },
    { value: 'Joko', label: 'Joko' },
    { value: 'Lina', label: 'Lina' },
    { value: 'Tono', label: 'Tono' },
    { value: 'Mira', label: 'Mira' },
  ];

  // Gaya kustom untuk react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#A64D79',
      borderColor: '#FFFFFF',
      color: '#FFFFFF',
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '1.125rem',
      '&:hover': {
        borderColor: '#FFFFFF',
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#FFFFFF',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#FFFFFF',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#FFE1F9',
      border: '1px solid #BC69A7',
      borderRadius: '4px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#D29BC7' : '#FFE1F9',
      color: state.isSelected ? '#FFFFFF' : '#6A1E55',
      '&:hover': {
        backgroundColor: '#D29BC7',
        color: '#FFFFFF',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#FFFFFF',
    }),
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAvailableProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData2) => ({
      ...prev,
      [name]: name === 'discount' ? Number(value) || 0 : value,
    }));
  };

  const handleCustomerChange = (selectedOption: any) => {
    setFormData((prev: FormData2) => ({
      ...prev,
      customer: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const discount = rawValue ? Number(rawValue) : 0;
    if (isNaN(discount)) return;

    const formattedValue = discount.toLocaleString('id-ID');
    setFormattedDiscount(formattedValue);
    setFormData((prev: FormData2) => ({
      ...prev,
      discount,
      totalPayment: prev.products.reduce((sum: number, p: Product) => sum + p.subtotal, 0) - discount,
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const product = availableProducts.find((p: AvailableProduct) => p.name === value);
    const quantity = name === 'quantity' ? Number(value) || 1 : selectedProduct.quantity;
    const price = product ? product.price : selectedProduct.price;

    setSelectedProduct((prev: Product) => ({
      ...prev,
      [name]: value,
      price: name === 'name' && product ? product.price : prev.price,
      quantity,
      subtotal: (name === 'name' && product ? product.price : prev.price) * quantity,
    }));
  };

  const handleAddProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedProduct.name) return;

    setFormData((prev: FormData2) => {
      const updatedProducts = [...prev.products, { ...selectedProduct }];
      const subtotal = updatedProducts.reduce((sum: number, p: Product) => sum + p.subtotal, 0);
      return {
        ...prev,
        products: updatedProducts,
        totalPayment: subtotal - prev.discount,
      };
    });
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setIsPopupOpen(false);
  };

  const handleEditProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedProduct.name || editIndex === null) return;

    setFormData((prev: FormData2) => {
      const updatedProducts = [...prev.products];
      updatedProducts[editIndex] = { ...selectedProduct };
      const subtotal = updatedProducts.reduce((sum: number, p: Product) => sum + p.subtotal, 0);
      return {
        ...prev,
        products: updatedProducts,
        totalPayment: subtotal - prev.discount,
      };
    });
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setIsEditPopupOpen(false);
    setEditIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      alert('Tambahkan setidaknya satu produk sebelum membayar.');
      return;
    }
    if (formData.paymentAmount === 0) {
      alert('Masukkan nominal pembayaran.');
      return;
    }
    if (formData.paymentAmount < formData.totalPayment) {
      alert('Nominal pembayaran tidak cukup.');
      return;
    }

    const transactionId = `#${Math.random().toString(36).substr(2, 3).toUpperCase()}729`;
    const formattedDate = getCurrentDate();

    const productString = formData.products
      .map((product: Product, index: number) => `${product.name} - ${product.quantity} pcs`)
      .join(', ');

    const newTransaction: Transaction = {
      id: transactionId,
      date: formattedDate,
      totalprice: formData.totalPayment,
      username: formData.customer,
      product: productString,
    };

    try {
      const response = await fetch('/seller/transactions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (response.ok) {
        setIsSuccessPopupOpen(true);
      } else {
        alert('Gagal menyimpan transaksi.');
      }
    } catch (error) {
      alert('Gagal menyimpan transaksi. Silakan coba lagi.');
      console.error('Error:', error);
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const payment = rawValue ? Number(rawValue) : 0;
    if (isNaN(payment)) return;

    const formattedValue = payment.toLocaleString('id-ID');
    setFormattedPayment(formattedValue);
    setFormData((prev: FormData2) => ({
      ...prev,
      paymentAmount: payment,
      change: payment - prev.totalPayment,
    }));
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
    setFormattedPayment('');
    setFormattedDiscount('');
    setFormData({
      date: getCurrentDate(),
      cashier: 'Nama Pegawai',
      customer: '',
      products: [],
      discount: 0,
      totalPayment: 0,
      paymentAmount: 0,
      change: 0,
    });
    router.push('/dashboardowner/penjualan/tambah');
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
  };

  const openEditPopup = (index: number) => {
    setEditIndex(index);
    setSelectedProduct({ ...formData.products[index] });
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setEditIndex(null);
  };

  return (
    <div className={`min-h-screen bg-[#6A1E55] p-8 ${cousine.className}`}>
      <style jsx>{`
        .custom-select-wrapper {
          position: relative;
          display: inline-block;
        }
        select.custom-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 2rem;
          background: #A64D79;
          color: #FFFFFF;
        }
        .custom-select-wrapper::after {
          content: '';
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #FFFFFF;
          pointer-events: none;
          transition: transform 0.2s ease;
        }
        select.custom-select:focus + .custom-select-wrapper::after {
          transform: translateY(-50%) rotate(180deg);
        }
        select.custom-select option {
          background: #FFE1F9;
          color: #000000;
        }
        select.custom-select option:disabled {
          color: #999999;
          font-style: italic;
        }
      `}</style>
      <div className="bg-[#A64D79] p-12 rounded-lg max-w-8xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-8">
            <div>
              <label className="block text-xl text-white mb-2 uppercase">Tanggal</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="px-4 py-2 rounded border border-white bg-[#A64D79] text-white text-lg"
                required
                aria-label="Tanggal transaksi"
              />
            </div>
            <div className="flex gap-6">
              <div>
                <label className="block text-xl text-white mb-2 uppercase">Pegawai</label>
                <div className="custom-select-wrapper">
                  <select
                    name="cashier"
                    value={formData.cashier}
                    onChange={handleInputChange}
                    className="px-4 py-2 rounded border border-white bg-[#A64D79] text-white text-lg custom-select"
                    aria-label="Pilih pegawai"
                  >
                    <option value="Nama Pegawai" disabled>Nama Pegawai</option>
                    <option value="Dwiki">Dwiki</option>
                    <option value="Nana">Nana</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xl text-white mb-2 uppercase">Pelanggan</label>
                <Select
                  options={customers}
                  onChange={handleCustomerChange}
                  placeholder="Pilih pelanggan"
                  isClearable
                  styles={customStyles}
                  aria-label="Pilih pelanggan"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <button
              type="button"
              onClick={openPopup}
              className="text-xl bg-[#FFE1F9] text-[#A64D79] rounded-lg font-bold mb-3 uppercase px-4 py-2 text-center"
              aria-label="Pilih produk untuk ditambahkan"
            >
              Pilih Produk
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FFE1F9]">
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">No</th>
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">Produk</th>
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">Jumlah</th>
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">Harga/satuan</th>
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">Subtotal</th>
                    <th className="p-3 text-center text-lg text-[#6A1E55] uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-[#6A1E55] text-lg">
                        Tidak ada transaksi
                      </td>
                    </tr>
                  ) : (
                    formData.products.map((product: Product, index: number) => (
                      <tr key={index} className="border-t text-[#D29BC7] text-xl text-center font-bold">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{product.name}</td>
                        <td className="p-4">{product.quantity}</td>
                        <td className="p-4">Rp{product.price.toLocaleString('id-ID')},00</td>
                        <td className="p-4">Rp{product.subtotal.toLocaleString('id-ID')},00</td>
                        <td className="p-4 flex gap-2 justify-center">
                          <button
                            type="button"
                            className="bg-[#D29BC7] text-white px-3 py-1 rounded"
                            onClick={() => openEditPopup(index)}
                            aria-label={`Edit produk ${product.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => {
                              setFormData((prev: FormData2) => {
                                const updatedProducts = prev.products.filter((_, i: number) => i !== index);
                                const subtotal = updatedProducts.reduce((sum: number, p: Product) => sum + p.subtotal, 0);
                                return {
                                  ...prev,
                                  products: updatedProducts,
                                  totalPayment: subtotal - prev.discount,
                                };
                              });
                            }}
                            aria-label={`Hapus produk ${product.name}`}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#FFE1F9] p-6 rounded-lg">
                <h2 className="text-xl text-[#6A1E55] font-bold mb-4 uppercase">Pilih Produk</h2>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="text-[#BC69A7]">
                      <th className="p-2 text-center uppercase">No</th>
                      <th className="p-2 text-center uppercase">Nama Produk</th>
                      <th className="p-2 text-center uppercase">Harga</th>
                      <th className="p-2 text-center uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableProducts.map((product: AvailableProduct, index: number) => (
                      <tr key={index} className="border-t text-[#BC69A7]">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">Rp{product.price.toLocaleString('id-ID')},00</td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              const newProduct = {
                                name: product.name,
                                quantity: selectedProduct.quantity,
                                price: product.price,
                                subtotal: product.price * selectedProduct.quantity,
                              };
                              setSelectedProduct(newProduct);
                              handleAddProduct(e);
                            }}
                            className="bg-[#BC69A7] text-white px-3 py-1 rounded uppercase"
                            aria-label={`Pilih produk ${product.name}`}
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mb-4">
                  <label className="block text-[#6A1E55] mb-2 uppercase">Jumlah</label>
                  <input
                    type="number"
                    name="quantity"
                    value={selectedProduct.quantity}
                    onChange={handleProductChange}
                    className="px-3 py-2 rounded border bg-[#FFE1F9] border-[#BC69A7] w-full"
                    min="1"
                    aria-label="Jumlah produk"
                  />
                </div>
                <div className="flex justify-start gap-4">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="bg-red-700 text-white px-4 py-2 rounded uppercase"
                    aria-label="Tutup popup"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEditPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#FFE1F9] p-6 rounded-lg">
                <h2 className="text-xl text-[#6A1E55] font-bold mb-4 uppercase text-center">Edit Transaksi</h2>
                <div className="mb-4">
                  <label className="block text-[#6A1E55] mb-2 uppercase">Nama Produk</label>
                  <input
                    name="name"
                    value={selectedProduct.name}
                    className="px-3 py-2 rounded border bg-[#D29BC7] border-[#BC69A7] w-full text-[#6A1E55]"
                    readOnly
                    aria-label="Nama produk"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#6A1E55] mb-2 uppercase">Jumlah</label>
                  <input
                    type="number"
                    name="quantity"
                    value={selectedProduct.quantity}
                    onChange={handleProductChange}
                    className="px-3 py-2 rounded border bg-[#FFE1F9] border-[#BC69A7] w-full"
                    min="1"
                    aria-label="Jumlah produk"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={closeEditPopup}
                    className="bg-red-700 text-white px-4 py-2 rounded uppercase"
                    aria-label="Batal edit"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleEditProduct}
                    className="bg-green-600 text-white px-4 py-2 rounded uppercase"
                    aria-label="Simpan perubahan"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {isSuccessPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#FFE1F9] p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#BC69A7] rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl text-[#6A1E55] font-bold mb-2 uppercase">Pembayaran Berhasil</h2>
                <p className="text-lg text-[#6A1E55] mb-4">
                  Kembalian Anda: Rp{(formData.change || 0).toLocaleString('id-ID')},00
                </p>
                <button
                  type="button"
                  onClick={closeSuccessPopup}
                  className="bg-[#BC69A7] text-white px-6 py-2 rounded uppercase"
                  aria-label="Selesai dan kembali"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-xl text-white mb-2 uppercase">Subtotal</label>
                <input
                  type="text"
                  value={`Rp${formData.products.reduce((sum: number, p: Product) => sum + p.subtotal, 0).toLocaleString('id-ID')},00`}
                  readOnly
                  className="px-4 py-2 rounded border border-white bg-[#A64D79] text-white text-lg"
                  aria-label="Subtotal"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xl text-white mb-2 uppercase">Diskon</label>
                <div className="relative w-80">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg">Rp</span>
                  <input
                    type="text"
                    name="discount"
                    value={formattedDiscount}
                    onChange={handleDiscountChange}
                    className="pl-8 py-2 rounded border border-white bg-[#A64D79] text-white text-lg placeholder-white"
                    placeholder="0"
                    aria-label="Diskon"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl text-white mb-2 uppercase">Total Pembayaran</label>
                <input
                  type="text"
                  value={`Rp${formData.totalPayment.toLocaleString('id-ID')},00`}
                  readOnly
                  className="px-4 py-2 rounded border border-white bg-white text-black text-lg"
                  aria-label="Total pembayaran"
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-xl text-white mb-2 uppercase">Nominal Pembayaran</label>
                <div className="relative w-80">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg">Rp</span>
                  <input
                    type="text"
                    name="paymentAmount"
                    value={formattedPayment}
                    onChange={handlePaymentChange}
                    className="pl-8 py-2 rounded border border-white bg-[#A64D79] text-white text-lg placeholder-white"
                    placeholder="0"
                    aria-label="Nominal pembayaran"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl text-white mb-2 uppercase">Kembalian</label>
                <input
                  type="text"
                  value={`Rp${(formData.change || 0).toLocaleString('id-ID')},00`}
                  readOnly
                  className="px-4 py-2 rounded border border-white bg-[#A64D79] text-white text-lg"
                  aria-label="Kembalian"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-end mt-8">
            <button
              type="button"
              onClick={() => router.push('/dashboardowner/penjualan')}
              className="bg-red-600 text-white px-6 py-2 rounded text-lg uppercase"
              aria-label="Batal dan kembali"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded text-lg uppercase"
              aria-label="Bayar transaksi"
            >
              Bayar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}