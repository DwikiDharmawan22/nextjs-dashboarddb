// definitions2.ts
import { ComponentType } from 'react';

// Customer
export interface Customer {
  username: string;
  email: string;
  phone: string;
  transactions: string[];
}

export interface FormData {
  username: string;
  email: string;
  phone: string;
}

// Transaction
export interface Transaction {
  id: string;
  date: string;
  totalprice: number; // Diubah dari string ke number
  username: string;
  product: string;
}

// Add Transaction
export interface Product {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface FormData2 {
  date: string;
  cashier: string;
  customer: string;
  products: Product[];
  discount: number;
  totalPayment: number;
  paymentAmount: number;
  change: number;
}

export interface AvailableProduct {
  name: string;
  price: number;
}

// Product
export interface SaleProduct {
  id: string;
  image: string;
  name: string;
  price: number; // Diubah dari string ke number
}

export interface EditForm {
  name: string;
  price: string;
}

// Dashboard
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// Profile
export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  facebook: string;
}

// Pelanggan
export interface ProductPelanggan {
  name: string;
  imageSrc: string;
  width: number;
  height: number;
  altText: string;
  link: string;
}

// About
export interface TeamMember {
  image: string;
  name: string;
  description: string;
}

// Shop
export interface ShopProduct {
  image: string;
  name: string;
  width: number;
  height: number;
  link: string;
}

// Product Details

export interface Product1 {
  image: string;
  name: string;
  description: string;
  materials: { name: string; icon?: ComponentType<any> }[];
  price: number;
  rating: number;
  navigation: {
    back: string;
    next: string;
  };
}

// Review
export interface reviewProduct {
  image: string;
  name: string;
  width: number;
  height: number;
  rating: number;
  description: string;
}

// Blog
export interface blogProduct {
  image: string;
  name: string;
  postDate: string;
  description: string;
}

// Contact
export interface Contact {
  location: string;
  phone: string;
  website: string;
}

//login
export interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
}
//forgot pass
export interface ForgotPasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
//regis
export interface RegisterFormData {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha?: string; // Optional, not used in form validation
}

export interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
  newPassword?: string;
  confirmPassword?: string;
  username?: string;
  nomorTelp?: string;
}