import { irishGrover } from '@/app/ui/fonts';
import { Contact } from '@/app/lib/definitions2';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaFacebook, FaPinterest, FaWhatsapp, FaInstagram } from 'react-icons/fa';

async function fetchContactData(): Promise<Contact> {
  const res = await fetch('/api/contact', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Gagal mengambil data kontak');
  }
  return res.json();
}

export default async function ContactPage() {
  const contactData = await fetchContactData();
  return (
    <div className="min-h-full bg-gradient-to-b text-white overflow-x-hidden">
      <div className="px-6 py-8">
        <h1 className={`${irishGrover.className} text-4xl text-center font-bold mb-10`}>
          KUNJUNGI TOKO OFFLINE KAMI
        </h1>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center justify-center">
          <div className="rounded-2xl overflow-hidden shadow-lg w-full md:w-1/2 border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1980.950048437384!2d110.4091234!3d-7.7748702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5782a2eae313%3A0x4b529648b9ad056!2sTaman%20Hutan%20Kota%20Universitas%20Sanata%20Dharma!5e0!3m2!1sen!2sid!4v1681818381796!5m2!1sen!2sid"
              className="w-full min-h-[400px] md:min-h-[500px] rounded-2xl"
            ></iframe>
          </div>

          <div className="w-full md:w-1/2 rounded-xl p-6 border border-white shadow-lg">
            <h2 className={`${irishGrover.className} text-2xl mb-4 text-center`}>KONTAK</h2>
            <div className={`${irishGrover.className} space-y-4 text-white/90 text-lg`}>
              <div className="flex items-center justify-center gap-4">
                <FaMapMarkerAlt className="text-2xl mt-1" />
                <p>{contactData.location}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <FaPhoneAlt className="text-2xl" />
                <p>{contactData.phone}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <FaGlobe className="text-2xl" />
                <p>{contactData.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white text-black text-sm mt-20 w-full">
        <div className="px-6 py-3 mx-auto md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-2 md:mb-0">
              <span className="font-semibold">Ikuti kami</span>
              <div className="flex gap-3 text-xl">
                <FaFacebook />
                <FaPinterest />
                <FaWhatsapp />
                <FaInstagram />
              </div>
            </div>
            <p>© 2025 Kemilau Topeng. All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}