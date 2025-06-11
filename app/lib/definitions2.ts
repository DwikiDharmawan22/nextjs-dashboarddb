import { ComponentType } from 'react';

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

export interface Transaction {
  id: string;
  date: string;
  totalprice: number;
  username: string;
  product: string;
}

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
  id?: string;
}

export interface SaleProduct {
  id: string;
  image: string;
  name: string;
  price: number;
}

export interface EditForm {
  name: string;
  price: string;
}

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

export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  facebook: string;
}

export interface ProductPelanggan {
  name: string;
  imageSrc: string;
  width: number;
  height: number;
  altText: string;
  link: string;
}

export interface TeamMember {
  image: string;
  name: string;
  description: string;
}

export interface ShopProduct {
  id: string;
  image: string;
  name: string;
  width: number;
  height: number;
  link: string;
}

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

export interface reviewProduct {
  image: string;
  name: string;
  width: number;
  height: number;
  rating: number;
  description: string;
}

export interface blogProduct {
  image: string;
  name: string;
  postDate: string;
  description: string;
}

export interface Contact {
  location: string;
  phone: string;
  website: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
}

export interface ForgotPasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha?: string;
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