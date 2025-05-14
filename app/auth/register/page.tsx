'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import SocialAuth from '@/components/SocialAuth';
import { doppio_one } from '@/app/ui/fonts';
import { RegisterFormData } from '@/app/lib/definitions2';
import { generateCaptcha } from '@/app/lib/data2';

const RegisterPage = () => {
    const router = useRouter();
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>();
    
    const password = watch('password', '');
    
    useEffect(() => {
        const strength = Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
        );
        setPasswordStrength(strength);
    }, [password]);

    useEffect(() => {
        setCaptcha(generateCaptcha());
        reset();
    }, [generateCaptcha, reset]);
    
    const onSubmit = (data: RegisterFormData) => {
        if (captchaInput !== captcha) {
            toast.error('Captcha tidak cocok!', { theme: 'dark' });
            return;
        }
        toast.success('Register Berhasil!', { theme: 'dark' });
        router.push('/home');
    };
    
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#6A1E55]">
            <div className="relative z-10 w-full max-w-7xl h-full mx-auto">
                <AuthFormWrapper>
                    <div className="bg-[#D29BC7] bg-opacity-90 p-8 rounded-[48px] shadow-lg w-full max-w-4xl mx-auto h-full">
                        <div className="flex flex-col items-center mb-4">
                            <h2 className={`${doppio_one.className} text-xl font-semibold text-[#6A1E55]`}>Register</h2>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                            {/* Username */}
                            <div className="space-y-1">
                                <label htmlFor="username" className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>
                                    Username <span className={`${doppio_one.className} text-gray-500 text-xs`}>(3-8 karakter)</span>
                                </label>
                                <input
                                    id="username"
                                    {...register('username', {
                                        required: 'Username wajib diisi',
                                        minLength: { value: 3, message: 'Username minimal 3 karakter' },
                                        maxLength: { value: 8, message: 'Username maksimal 8 karakter' },
                                    })}
                                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                                    placeholder="Masukkan username"
                                />
                                {errors.username && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.username.message}</p>}
                            </div>
                            
                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email wajib diisi',
                                        pattern: {
                                            value: /^[\w.-]+@[\w.-]+\.(com|net|co)$/,
                                            message: 'Format email tidak valid',
                                        },
                                    })}
                                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                                    placeholder="Masukkan email"
                                />
                                {errors.email && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.email.message}</p>}
                            </div>
                            
                            {/* Nomor Telepon */}
                            <div className="space-y-1">
                                <label htmlFor="nomorTelp" className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>Nomor Telepon</label>
                                <input
                                    id="nomorTelp"
                                    type="text"
                                    {...register('nomorTelp', {
                                        required: 'Nomor telepon wajib diisi',
                                        minLength: { value: 10, message: 'Nomor telepon minimal 10 karakter' },
                                        pattern: { value: /^[0-9]+$/, message: 'Nomor telepon hanya boleh berisi angka' },
                                    })}
                                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                                    placeholder="Masukkan nomor telepon"
                                />
                                {errors.nomorTelp && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.nomorTelp.message}</p>}
                            </div>
                            
                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className={`${doppio_one.className} block text-sm font-medium text-[#A64D79]`}>Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', {
                                            required: 'Password wajib diisi',
                                            minLength: { value: 8, message: 'Minimal 8 karakter' }
                                        })}
                                        className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                                        placeholder="Masukkan password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.password.message}</p>}
                                
                                {/* Indikator Kekuatan Password */}
                                <div className="mt-1">
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-1.5 ${passwordStrength === 100 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${passwordStrength}%` }}></div>
                                    </div>
                                    <p className={`${doppio_one.className} text-xs text-gray-600 mt-1`}>Strength: {passwordStrength}%</p>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label htmlFor="confirmPassword" className={`${doppio_one.className} block text-sm font-medium text-[#A64D79]`}>Konfirmasi Password</label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register('confirmPassword', {
                                            required: 'Konfirmasi password wajib diisi',
                                            validate: value => value === password || 'Konfirmasi password tidak cocok'
                                        })}
                                        className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-colors placeholder-white`}
                                        placeholder="Masukkan ulang password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className={`${doppio_one.className} text-red-500 text-sm`}>{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Captcha */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-3">
                                    <span className={`${doppio_one.className} text-sm font-medium text-[#A64D79]`}>Captcha:</span>
                                    <span className={`${doppio_one.className} font-mono text-lg font-bold text-[#6A1E55] bg-[#FFE1F9] px-3 py-1 rounded`}>
                                        {captcha}
                                    </span>
                                    <FaRedo className="text-pink-600 hover:text-pink-800 cursor-pointer" size={14} onClick={() => setCaptcha(generateCaptcha())} />
                                </div>
                                <input
                                    type="text"
                                    {...register('captcha', { required: 'Captcha wajib diisi' })}
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    className={`${doppio_one.className} w-full px-4 py-2 rounded-lg bg-[#D29BC7] bg-opacity-90 border focus:ring-2 focus:outline-none transition-colors placeholder-white ${
                                        errors.captcha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-pink-300'
                                    }`}
                                    placeholder="Masukkan captcha"
                                />
                                {errors.captcha && <p className={`${doppio_one.className} text-red-600 text-sm italic`}>{errors.captcha.message}</p>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`${doppio_one.className} w-full font-semibold py-2 rounded-lg transition-colors duration-200 bg-[#FFE1F9] hover:bg-pink-600 text-[#6A1E55]`}
                            >
                                Register
                            </button>
                            
                            <SocialAuth />
                            
                            <p className={`${doppio_one.className} mt-4 text-center text-sm text-gray-600`}>
                                Sudah punya akun?{' '}
                                <Link href="/auth/login" className="text-[#6A1E55] hover:text-pink-800 font-semibold">
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

export default RegisterPage;