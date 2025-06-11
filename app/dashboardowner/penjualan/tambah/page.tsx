'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cousine } from '@/app/ui/fonts';
import { FormData2, Product, Transaction, AvailableProduct } from '@/app/lib/definitions2';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddSalesPage() {
  const router = useRouter();

  // Fungsi untuk memformat tanggal saat ini ke format DD/MM/YYYY berdasarkan 11:00 AM WIB, 11 Juni 2025
  const getCurrentDate = () => {
    const now = new Date('2025-06-11T11:00:00+07:00'); // WIB
    return now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).split('/').join('/');
  };

  const [formData, setFormData] = useState<FormData2>({
    date: getCurrentDate(),
    cashier: 'Dwiki', // Default to first admin, can be adjusted
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
  const [customers, setCustomers] = useState<{ value: string; label: string }[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [formattedPayment, setFormattedPayment] = useState<string>('');
  const [formattedDiscount, setFormattedDiscount] = useState<string>('');
  const [quantityInput, setQuantityInput] = useState<string>('1');

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

  // Memuat produk dan pengguna dari API saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      try {
        // Memuat produk
        const productResponse = await fetch('/api/products');
        if (!productResponse.ok) throw new Error(`Gagal memuat produk: ${productResponse.status}`);
        const productsData = await productResponse.json();
        setAvailableProducts(productsData.rows); // Akses rows

        // Memuat pelanggan (role: user)
        const customerResponse = await fetch('/api/users?role=user');
        if (!customerResponse.ok) throw new Error(`Gagal memuat pelanggan: ${customerResponse.status}`);
        const customersData = await customerResponse.json();
        setCustomers(customersData.map((user: { username: string }) => ({
          value: user.username,
          label: user.username,
        })));

        // Memuat pegawai/admin (role: admin)
        const adminResponse = await fetch('/api/users?role=admin');
        if (!adminResponse.ok) throw new Error(`Gagal memuat admin: ${adminResponse.status}`);
        const adminsData = await adminResponse.json();
        setAdmins(adminsData.map((user: { username: string }) => user.username));
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('Gagal memuat data. Periksa koneksi atau server.');
      }
    };
    loadData();
  }, []);

  // Sinkronisasi totalPayment dan kembalian saat products, discount, atau paymentAmount berubah
  useEffect(() => {
    setFormData((prev) => {
      const subtotal = prev.products.reduce((sum: number, p: Product) => sum + p.subtotal, 0);
      const newTotalPayment = subtotal - prev.discount >= 0 ? subtotal - prev.discount : 0;
      const newChange = prev.paymentAmount - newTotalPayment;
      return {
        ...prev,
        totalPayment: newTotalPayment,
        change: newChange,
      };
    });
  }, [formData.products, formData.discount, formData.paymentAmount]);

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
    }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setQuantityInput(value);
      const quantity = value === '' ? 0 : Number(value);
      setSelectedProduct((prev: Product) => ({
        ...prev,
        quantity: isNaN(quantity) || quantity < 0 ? 0 : quantity,
        subtotal: prev.price * (isNaN(quantity) || quantity < 0 ? 0 : quantity),
      }));
    } else {
      const product = availableProducts.find((p: AvailableProduct) => p.name === value);
      const price = product ? product.price : selectedProduct.price;
      setSelectedProduct((prev: Product) => ({
        ...prev,
        [name]: value,
        price: name === 'name' && product ? product.price : prev.price,
        subtotal: price * prev.quantity,
      }));
    }
  };

  const handleAddProduct = (e: React.MouseEvent<HTMLButtonElement>, product: AvailableProduct) => {
    e.preventDefault();
    const quantity = Number(quantityInput) || 1;
    if (quantity < 1) {
      alert('Jumlah harus minimal 1.');
      return;
    }
    const newProduct = {
      name: product.name,
      quantity,
      price: product.price,
      subtotal: product.price * quantity,
    };

    setFormData((prev: FormData2) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
    setQuantityInput('1');
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setIsPopupOpen(false);

    toast.success(
      <div className="flex items-center gap-2">
        <span>Produk berhasil ditambahkan!</span>
      </div>,
      {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          fontSize: '1.25rem',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#34D399',
          color: '#000000',
        },
      }
    );
  };

  const handleEditProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedProduct.name || editIndex === null) return;

    const quantity = Number(quantityInput) || 1;
    if (quantity < 1) {
      alert('Jumlah harus minimal 1.');
      return;
    }

    const originalProduct = formData.products[editIndex];
    const updatedProduct = { ...selectedProduct, quantity, subtotal: selectedProduct.price * quantity };

    const isChanged =
      originalProduct.quantity !== updatedProduct.quantity ||
      originalProduct.subtotal !== updatedProduct.subtotal;

    setFormData((prev: FormData2) => {
      const updatedProducts = [...prev.products];
      updatedProducts[editIndex] = updatedProduct;
      return {
        ...prev,
        products: updatedProducts,
      };
    });

    if (isChanged) {
      toast.success(
        <div className="flex items-center gap-2">
          <span>Produk berhasil diedit!</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
          style: {
            fontSize: '1.25rem',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#34D399',
            color: '#000000',
          },
        }
      );
    } else {
      toast.info(
        <div className="flex items-center gap-2">
          <span>Tidak ada perubahan pada produk.</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
          style: {
            fontSize: '1.25rem',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
          },
        }
      );
    }

    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setQuantityInput('1');
    setIsEditPopupOpen(false);
    setEditIndex(null);
  };

  const handleDeleteProduct = (index: number) => {
    setFormData((prev: FormData2) => ({
      ...prev,
      products: prev.products.filter((_, i: number) => i !== index),
    }));

    toast.success(
      <div className="flex items-center gap-2">
        <span>Produk berhasil dihapus!</span>
      </div>,
      {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          fontSize: '1.25rem',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#34D399',
          color: '#000000',
        },
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      alert('Tambahkan setidaknya satu produk sebelum membayar.');
      return;
    }
    if (!formData.customer) {
      alert('Pilih pelanggan sebelum membayar.');
      return;
    }
    if (formData.paymentAmount <= 0) {
      alert('Nominal pembayaran harus lebih dari 0.');
      return;
    }
    if (formData.totalPayment <= 0) {
      alert('Total pembayaran harus lebih dari 0.');
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
      totalprice: Number(formData.totalPayment),
      username: formData.customer,
      product: productString,
    };

    console.log('Sending transaction:', JSON.stringify(newTransaction, null, 2));

    try {
      const response = await fetch('/api/transactions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });
      if (response.ok) {
        console.log('Transaksi berhasil disimpan');
        setIsSuccessPopupOpen(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData, 'Status:', response.status);
        alert(`Gagal menyimpan transaksi: ${errorData.message || `Server error ${response.status}`}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Gagal menyimpan transaksi. Periksa koneksi Anda atau pastikan server berjalan.');
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
    }));
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
    setFormattedPayment('');
    setFormattedDiscount('');
    setFormData({
      date: getCurrentDate(),
      cashier: admins[0] || 'Dwiki', // Default to first admin if available
      customer: '',
      products: [],
      discount: 0,
      totalPayment: 0,
      paymentAmount: 0,
      change: 0,
    });
    setQuantityInput('1');
    router.push('/dashboardowner/penjualan');
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setQuantityInput('1');
  };

  const openEditPopup = (index: number) => {
    setEditIndex(index);
    const product = formData.products[index];
    setSelectedProduct({ ...product });
    setQuantityInput(product.quantity.toString());
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedProduct({ name: '', quantity: 1, price: 0, subtotal: 0 });
    setQuantityInput('1');
    setEditIndex(null);
  };

  const formatChange = (change: number) => {
    if (change >= 0) {
      return `Rp${change.toLocaleString('id-ID')},00`;
    } else {
      return `-Rp${Math.abs(change).toLocaleString('id-ID')},00`;
    }
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
        .pilih-button {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .pilih-button:hover {
          background-color: #A64D79;
          transform: scale(1);
        }
      `}</style>
      <ToastContainer />
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
                    <option value="" disabled>Pilih Pegawai</option>
                    {admins.map((admin) => (
                      <option key={admin} value={admin}>{admin}</option>
                    ))}
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
                            onClick={() => handleDeleteProduct(index)}
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
                            onClick={(e) => handleAddProduct(e, product)}
                            className="pilih-button bg-[#BC69A7] text-white px-3 py-1 rounded uppercase"
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
                    value={quantityInput}
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
                    value={quantityInput}
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
                  Kembalian Anda: {formatChange(formData.change)}
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
                  value={formatChange(formData.change)}
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