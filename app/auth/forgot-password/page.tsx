'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import { doppio_one } from '@/app/ui/fonts';
import { ForgotPasswordFormData, ErrorObject } from '@/app/lib/definitions2';
import { VALID_EMAIL1, ADMIN_EMAIL1, calculatePasswordStrength } from '@/app/lib/data2';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = (): ErrorObject => {
    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    else if (formData.email !== VALID_EMAIL1 && formData.email !== ADMIN_EMAIL1)
      newErrors.email = 'Email tidak terdaftar';

    if (!formData.newPassword.trim()) newErrors.newPassword = 'Password baru tidak boleh kosong';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password minimal 8 karakter';

    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === 'newPassword') {
      calculatePasswordStrength(value, setPasswordStrength);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Gagal mereset password!', { theme: 'dark', position: 'top-right' });
      return;
    }

    toast.success('Password berhasil direset!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-start bg-[#6A1E55]">
      <div className="relative z-10 w-full max-w-7xl h-full mx-auto">
        <AuthFormWrapper>
          <div className="bg-[#D29BC7] bg-opacity-90 p-8 rounded-[48px] shadow-lg w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-4">
              <h2 className={`${doppio_one.className} text-xl font-semibold text-[#6A1E55]`}>Lupa Password</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}
                >
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
                {errors.email && (
                  <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="newPassword"
                  className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}
                >
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.newPassword}</p>
                )}
                <div className="text-sm text-[#A64D79] mt-1">
                  Kekuatan: {passwordStrength}%
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}
                >
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                    placeholder="Masukkan konfirmasi password baru"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className={`${doppio_one.className} w-full font-semibold py-2 rounded-lg transition-colors duration-200 bg-[#FFE1F9] hover:bg-pink-600 text-[#6A1E55]`}
              >
                Konfirmasi
              </button>

              <p className={`${doppio_one.className} mt-4 text-center text-sm text-gray-600`}>
                Kembali ke{' '}
                <Link
                  href="/auth/login"
                  className="text-[#6A1E55] hover:text-pink-800 font-semibold"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;