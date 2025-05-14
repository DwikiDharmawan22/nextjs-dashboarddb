// owner
// pelanggan
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
//penjualan
export interface Transaction {
  id: string;
  date: string;
  totalPrice: string;
  username: string;
  product: string;
}
// tambah penjualan
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

     export interface Transaction {
       id: string;
       date: string;
       totalPrice: string;
       username: string;
       product: string;
     }

     export interface AvailableProduct {
       name: string;
       price: number;
     }

//product

export interface SaleProduct {
  id: string;
  image: string;
  name: string;
  price: string;
}

export interface EditForm {
  name: string;
  price: string;
}
// dashboardowner
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
//profile
export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  facebook: string;
}


//Pelanggan
export interface ProductPelanggan {
  name: string;
  imageSrc: string;
  width: number;
  height: number;
  altText: string;
  link: string;
}

// about
export interface TeamMember {
  image: string;
  name: string;
  desc: string;
}

//Shop
export interface ShopProduct {
  image: string;
  name: string;
  width: number;
  height: number;
  link: string;
}

//product
//product 1
import { ComponentType } from 'react';

export interface Product1 {
  image: string;
  name: string;
  description: string;
  materials: { name: string; icon: ComponentType<any> }[];
  price: string;
  rating: number;
  navigation: {
    back: string;
    next: string;
  };
}

//review
export interface reviewProduct {
  image: string;
  name: string;
  width: number;
  height: number;
  rating: number;
  description: string;
}

//blog
export interface blogProduct {
  image: string;
  name: string;
  postDate: string;
  description: string;
}

//Contact
export interface Contact {
  location: string;
  phone: string;
  website: string;
}