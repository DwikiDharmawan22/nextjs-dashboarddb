// components/AuthFormWrapper.tsx
import React, { ReactNode } from 'react';
import Image from 'next/image';

interface AuthFormWrapperProps {
  title?: string;
  children: ReactNode;
}

const AuthFormWrapper = ({ title, children }: AuthFormWrapperProps) => {
  return (
    <div className="relative w-full rounded-xl shadow-lg p-8 mx-auto">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full rounded-xl z-0">
        <Image
          src="/bg regist, login, lupa pw.jpeg"
          alt="Background"
          fill
          className="object-cover rounded-xl"
          priority
          quality={80}
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50 rounded-xl z-10 border-8 border-[#A64D79]" />
      {/* Content */}
      <div className="relative z-20 bg-opacity-90 rounded-xl p-6 max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthFormWrapper;