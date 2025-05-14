'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { doppio_one } from '@/app/ui/fonts';
import { LoginFormData, ErrorObject } from '@/app/lib/definitions2';
import { VALID_EMAIL, VALID_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD, generateRandomCaptcha } from '@/app/lib/data2';

// Dynamic import untuk komponen yang mungkin menggunakan browser APIs
const SocialAuth = dynamic(() => import('@/components/SocialAuth'), {
  ssr: false,
  loading: () => <p>Loading social auth...</p>
});

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [captcha, setCaptcha] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateRandomCaptcha());
  }, []);

  // Initialize captcha only on client side
  useEffect(() => {
    if (isClient) {
      refreshCaptcha();
    }
  }, [isClient, refreshCaptcha]);

  const validateForm = (): ErrorObject => {
    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    else if (formData.email !== VALID_EMAIL && formData.email !== ADMIN_EMAIL) newErrors.email = 'Email tidak sesuai';

    if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
    else if (
      (formData.email === VALID_EMAIL && formData.password !== VALID_PASSWORD) ||
      (formData.email === ADMIN_EMAIL && formData.password !== ADMIN_PASSWORD)
    ) newErrors.password = 'Password tidak sesuai';

    if (formData.captchaInput !== captcha) newErrors.captcha = 'Captcha tidak  valid';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (loginAttempts > 0) {
        setLoginAttempts((prev) => Math.max(0, prev - 1));
        if (loginAttempts - 1 > 0) {
          toast.error(`Login Gagal! Sisa kesempatan: ${Math.max(0, loginAttempts - 1)}`, {
            theme: 'dark',
            position: 'top-right',
          });
        } else {
          toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
        }
      }
      return;
    }

    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });

    // Navigate based on role without using localStorage
    if (formData.email === ADMIN_EMAIL) {
      router.push('/dashboardowner');
    } else {
      router.push('/dashboard');
    }
  };

  const resetAttempts = () => {
    setLoginAttempts(3);
    toast.success('Kesempatan login berhasil direset', { theme: 'dark', position: 'top-right' });
  };

  // Render nothing during SSR for elements that depend on client-side state
  if (!isClient) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-start bg-[#6A1E55]">
      <div className="relative z-10 w-full max-w-7xl h-full mx-auto">
        <AuthFormWrapper>
          <div className="bg-[#D29BC7] bg-opacity-90 p-8 rounded-[48px] shadow-lg w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-4">
              <h2 className={`${doppio_one.className} text-xl font-semibold text-[#6A1E55]`}>Login</h2>
              <p className={`${doppio_one.className} text-sm text-white`}>Sisa Kesempatan: {loginAttempts}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="space-y-1">
                <label htmlFor="email" className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                  placeholder="Masukkan email"
                />
                {errors.email && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </button>
                </div>
                {errors.password && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className={`${doppio_one.className} flex items-center space-x-2`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-pink-500 focus:ring-pink-300 border-gray-300 rounded"
                  />
                  <span className="text-white">Ingat saya</span>
                </label>
                <Link href="/auth/forgot-password" className={`${doppio_one.className} text-[#6A1E55] hover:text-pink-800 font-medium`}>
                  Lupa Password?
                </Link>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>Captcha:</span>
                  <span className={`${doppio_one.className} font-mono text-lg font-bold text-[#6A1E55] bg-[#FFE1F9] px-3 py-1 rounded`}>
                    {captcha}
                  </span>
                  <FaRedo className="text-pink-600 hover:text-pink-800 cursor-pointer" onClick={refreshCaptcha} />
                </div>
                <input
                  type="text"
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border focus:ring-2 focus:outline-none transition-colors placeholder-white ${
                    errors.captcha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-pink-300'
                  }`}
                  placeholder="Masukkan captcha"
                />
                {errors.captcha && <p className={`${doppio_one.className} text-red-600 text-sm italic`}>{errors.captcha}</p>}
              </div>

              <button
                type="submit"
                className={`${doppio_one.className} w-full font-semibold py-2 rounded-lg transition-colors duration-200 ${
                  loginAttempts > 0 ? 'bg-[#FFE1F9] hover:bg-pink-600 text-[#6A1E55]' : 'bg-[#FFE1F9] text-[#6A1E55] cursor-not-allowed'
                }`}
                disabled={loginAttempts === 0}
              >
                Masuk
              </button>

              <button
                className={`${doppio_one.className} w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                  loginAttempts === 0 ? 'bg-[#D29BC7] hover:bg-pink-600 text-[#FFE1F9]' : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                }`}
                onClick={resetAttempts}
                disabled={loginAttempts !== 0}
              >
                Reset Kesempatan
              </button>

              <SocialAuth />

              <p className={`${doppio_one.className} mt-4 text-center text-sm text-gray-600`}>
                Tidak punya akun?{' '}
                <Link href="/auth/register" className="text-[#6A1E55] hover:text-pink-800 font-semibold">
                  Daftar
                </Link>
              </p>
            </form>
          </div>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default LoginPage;