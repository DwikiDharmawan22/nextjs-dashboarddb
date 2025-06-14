import { irishGrover } from '@/app/ui/fonts';
import { Contact } from '@/app/lib/definitions2';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaFacebook, FaPinterest, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { headers } from 'next/headers';

async function fetchContactData(): Promise<Contact> {
  try {
    const headersList = await headers(); // Tambahkan await di sini
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const res = await fetch(`${baseUrl}/api/contact`, { cache: 'no-store' });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gagal mengambil data: ${res.status} - ${errorText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default async function ContactPage() {
  let contactData;
  try {
    contactData = await fetchContactData();
  } catch (error) {
    console.error('Error in ContactPage:', error);
    return (
      <div className="min-h-full bg-gradient-to-b text-white overflow-x-hidden p-6 text-center">
        <h1 className={`${irishGrover.className} text-4xl font-bold mb-10`}>Terjadi Kesalahan</h1>
        <p>Gagal memuat data kontak. Silakan coba lagi nanti.</p>
      </div>
    );
  }

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
    </div>
  );
}