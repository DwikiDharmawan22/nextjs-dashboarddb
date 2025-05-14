// pelanggan
import { Customer } from './definitions2';

export const defaultCustomers: Customer[] = [
  {
    username: 'Century',
    email: 'cent29@gmail.com',
    phone: '0836181937',
    transactions: ['2 Topeng Cicilia', '1 Topeng Hudoq', '10 Topeng Jesica'],
  },
  {
    username: 'Yonoji',
    email: 'cent29@gmail.com',
    phone: '0836181937',
    transactions: ['2 Topeng Cicilia', '10 Topeng Jesica'],
  },
  {
    username: 'Sutami',
    email: 'cent29@gmail.com',
    phone: '0836181937',
    transactions: ['2 Topeng Cicilia', '5 Topeng Hudoq'],
  },
  {
    username: 'Ohena',
    email: 'cent29@gmail.com',
    phone: '0836181937',
    transactions: ['2 Topeng Cicilia', '1 Topeng Hudoq', '19 Topeng Jesica'],
  },
];

export const loadCustomers = (): Customer[] => {
  try {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    if (storedCustomers.length === 0) {
      localStorage.setItem('customers', JSON.stringify(defaultCustomers));
      return defaultCustomers;
    }
    return storedCustomers.map((customer: Customer) => ({
      ...customer,
      transactions: Array.isArray(customer.transactions) ? customer.transactions : [],
    }));
  } catch (error) {
    console.error('Error parsing customers from localStorage:', error);
    return [];
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

//penjualan
import { Transaction, AvailableProduct } from './definitions2';

export const defaultTransactions: Transaction[] = [
  { id: '#J729', date: '2025-10-08 10:40:45', totalPrice: 'Rp1.000.000,00', username: 'Paijo', product: 'Topeng Cicilia - 2 pcs' },
  { id: '#K729', date: '2025-10-08 10:40:45', totalPrice: 'Rp1.118.000,00', username: 'Tuyul', product: 'Topeng Jesica - 3 pcs' },
  { id: '#L729', date: '2025-10-08 10:40:45', totalPrice: 'Rp600.000,00', username: 'Kucing', product: 'Topeng Dwiki - 2 pcs' },
  { id: '#M729', date: '2025-10-08 10:40:45', totalPrice: 'Rp500.000,00', username: 'Hujan', product: 'Topeng Hudoo - 1 pcs' },
];

export const loadTransactions = (): Transaction[] => {
  try {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    if (storedTransactions.length === 0) {
      localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
      return defaultTransactions;
    }
    return storedTransactions.map((transaction: Transaction) => ({
      id: transaction.id || '',
      date: transaction.date || '',
      totalPrice: transaction.totalPrice || '',
      username: transaction.username || '',
      product: transaction.product || '',
    }));
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error);
    return defaultTransactions;
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// tambah penjualan

export const availableProducts: AvailableProduct[] = [
  { name: 'Topeng Cicilia', price: 500000 },
  { name: 'Topeng Jesica', price: 350000 },
  { name: 'Topeng Dwiki', price: 300000 },
  { name: 'Topeng Hudoq', price: 400000 },
];

export const saveTransaction = (newTransaction: Transaction): void => {
  try {
    const stored = localStorage.getItem('transactions');
    const existingTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
    const updatedTransactions = [...existingTransactions, newTransaction];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Error saving transaction to localStorage:', error);
    throw new Error('Failed to save transaction');
  }
};
//product
import { SaleProduct } from './definitions2';

export const defaultProducts: SaleProduct[] = [
  { id: '#J729', image: '/topeng cicilia.png', name: 'Topeng Cicilia', price: '500.000 IDR' },
  { id: '#K729', image: '/topeng jesica.png', name: 'Topeng Jesica', price: '370.000 IDR' },
  { id: '#L729', image: '/topeng dwiki.png', name: 'Topeng Dwiki', price: '300.000 IDR' },
];

export const loadProducts = (): SaleProduct[] => {
  try {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (storedProducts.length === 0) {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return storedProducts.map((product: SaleProduct) => ({
      id: product.id || '',
      image: product.image || '',
      name: product.name || '',
      price: product.price || '',
    }));
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return defaultProducts;
  }
};

export const saveProducts = (products: SaleProduct[]): void => {
  localStorage.setItem('products', JSON.stringify(products));
};

//dashboard
import { ChartData } from './definitions2';

export const fetchDashboardData = async (setDailyIncomeData: (data: ChartData) => void, setMonthlyIncomeData: (data: ChartData) => void, setLoading: (loading: boolean) => void) => {
  try {
    // Simulate delay fetching data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDailyIncomeData({
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
      datasets: [{
        label: "Pendapatan Harian",
        data: [30000, 35000, 20000, 25000, 40000],
        backgroundColor: "#29CA2E",
        borderColor: "#29CA2E",
        borderWidth: 1,
      }],
    });

    setMonthlyIncomeData({
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
      datasets: [{
        label: "Pendapatan Bulanan",
        data: [15000, 20000, 25000, 30000, 18000, 22000, 28000, 32000, 20000, 25000, 15000, 10000],
        backgroundColor: "#E92020",
        borderColor: "#E92020",
        borderWidth: 1,
      }],
    });

    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
  }
};

//profile
import { Profile } from '@/app/lib/definitions2';

export const profileData: Profile = {
  name: 'Dwiki Dharmawan',
  role: 'Pegawai',
  email: 'cicilia175@gmail.com',
  phone: '083418461937',
  facebook: '@Ciciliaaa',
};

//Pelanggan
import { ProductPelanggan } from '@/app/lib/definitions2';

export const products: ProductPelanggan[] = [
  {
    name: "TOPENG DWIKI",
    imageSrc: "/topeng dwiki.png",
    width: 190,
    height: 150,
    altText: "Topeng Dwiki",
    link: "/dashboard/product",
  },
  {
    name: "TOPENG JESICA",
    imageSrc: "/topeng jesica.png",
    width: 150,
    height: 150,
    altText: "Topeng Jesica",
    link: "/dashboard/product/product2",
  },
  {
    name: "TOPENG CICILIA",
    imageSrc: "/topeng cicilia.png",
    width: 167,
    height: 150,
    altText: "Topeng Cicilia",
    link: "/dashboard/product/product3",
  },
];

// about
import { TeamMember } from '@/app/lib/definitions2';

export const teamMembers: TeamMember[] = [
  {
    image: '/dwiki.png',
    name: 'Dwiki Dharmawan',
    desc: 'Barongsai KW yang menjadi astagfirullah gatau mau nulis apa',
  },
  {
    image: '/Jesica.png',
    name: 'Jesica Sihombing',
    desc: 'China KW gatau juga ini mau ngetik apaan tapi yaudahlah yahh',
  },
  {
    image: '/cicilia.png',
    name: 'Cicilia Gadja',
    desc: 'nama ku gadja yaa bukan gadjah apalagi gajah #krisis identitas',
  },
];

//Shop
import { ShopProduct } from '@/app/lib/definitions2';

export const shopproducts: ShopProduct[] = [
  {
    image: '/topeng dwiki.png',
    name: 'TOPENG DWIKI',
    width: 150,
    height: 150,
    link: '/dashboard/product',
  },
  {
    image: '/topeng jesica.png',
    name: 'TOPENG JESICA',
    width: 220,
    height: 240,
    link: '/dashboard/product/product2',
  },
  {
    image: '/topeng cicilia.png',
    name: 'TOPENG CICILIA',
    width: 220,
    height: 240,
    link: '/dashboard/product/product3',
  },
  {
    image: '/topeng jesica.png',
    name: 'TOPENG CICILIA',
    width: 220,
    height: 240,
    link: '/dashboard/product',
  },
];

//product
//product1
import { Product1 } from '@/app/lib/definitions2';
import { FaCubes, FaFileAlt, FaPaintBrush } from 'react-icons/fa';

export const product1: Product1 = {
  image: '/topeng dwiki.png',
  name: 'TOPENG DWIKI',
  description: 'THIS IS A MASK THAT COMES FROM THE RIAU ISLANDS.\nWHERE THIS MASK IS A PP TEACHING ASSISTANT, THIS\nMASK CAN ALSO COPE.',
  materials: [
    { name: 'SELECTED MAHOGANY WOOD', icon: FaCubes },
    { name: 'DUMLING PAPER', icon: FaFileAlt },
    { name: 'HIGHLY PIGMENTED NATURAL PAINT', icon: FaPaintBrush },
  ],
  price: 'RP 300.000,-',
  rating: 4.5,
  navigation: {
    back: '/dashboard/product/product3',
    next: '/dashboard/product/product2',
  },
};

//product2
export const product2: Product1 = {
  image: '/topeng jesica.png',
  name: 'TOPENG JESICA',
  description: 'THIS IS A MASK THAT COMES FROM BATAK, WHERE THIS.\nMASK IS A CHINESE IMITATION, THIS MASK CAN ALSO\nCODE.',
  materials: [
    { name: 'SELECTED MAHOGANY WOOD', icon: FaCubes },
    { name: 'DUMPLING PAPER', icon: FaFileAlt },
    { name: 'HIGHLY PIGMENTED NATURAL PAINT', icon: FaPaintBrush },
  ],
  price: 'RP 370.000,-',
  rating: 3.5,
  navigation: {
    back: '/dashboard/product2',
    next: '/dashboard/product/product3',
  },
};

//product 3
export const product3: Product1 = {
  image: '/topeng cicilia.png',
  name: 'TOPENG CICILIA',
  description: 'THIS IS A MASK THAT COMES FROM JAKARTA, WHERE THIS\nMASK IS EXPERIENCING A BIT OF AN IDENTITY CRISIS,\nTHIS MASK CAN ALSO COPE.',
  materials: [
    { name: 'SELECTED MAHOGANY WOOD', icon: FaCubes },
    { name: 'DUMPLING PAPER', icon: FaFileAlt },
    { name: 'HIGHLY PIGMENTED NATURAL PAINT', icon: FaPaintBrush },
  ],
  price: 'RP 500.000,-',
  rating: 5,
  navigation: {
    back: '/dashboard/product/product2',
    next: '/dashboard/product',
  },
};

//review
import { reviewProduct } from '@/app/lib/definitions2';

export const reviewproducts: reviewProduct[] = [
  {
    image: '/topeng dwiki.png',
    name: 'TOPENG DWIKI',
    width: 130,
    height: 130,
    rating: 4.5,
    description: 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.',
  },
  {
    image: '/topeng jesica.png',
    name: 'TOPENG JESICA',
    width: 200,
    height: 220,
    rating: 4.5,
    description: 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.',
  },
  {
    image: '/topeng cicilia.png',
    name: 'TOPENG CICILIA',
    width: 200,
    height: 220,
    rating: 4.5,
    description: 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.',
  },
];

//blog
import { blogProduct } from '@/app/lib/definitions2';

export const blogproducts: blogProduct[] = [
  {
    image: '/topeng jesica.png',
    name: 'Topeng Jesica',
    postDate: '05 Jan, 2023',
    description: 'Used in the hudoq dance,\na traditional art of the Dayak tribe.',
  },
  {
    image: '/topeng cicilia.png',
    name: 'Topeng Cicilia',
    postDate: '05 Jan, 2023',
    description: 'Used in the hudoq dance,\na traditional art of the Dayak tribe.',
  },
  {
    image: '/topeng cicilia.png',
    name: 'Topeng Cicilia',
    postDate: '05 Jan, 2023',
    description: 'Used in the hudoq dance,\na traditional art of the Dayak tribe.',
  },
  {
    image: '/topeng jesica.png',
    name: 'Topeng Jesica',
    postDate: '05 Jan, 2023',
    description: 'Used in the hudoq dance,\na traditional art of the Dayak tribe.',
  },
];

//contact
import { Contact } from '@/app/lib/definitions2';

export const contactData: Contact = {
  location: 'Jalan Kebenaran dan Hidup\nNo. 77, Sleman Concat\nBabarsari Depok',
  phone: '0821-2881-1829',
  website: 'www.uajy.ac.id',
};