'use client';

import Image from 'next/image';
import { creepster, irishGrover } from '@/app/ui/fonts';
import { TeamMember } from '@/app/lib/definitions2';
import { teamMembers } from '@/app/lib/data2';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white px-6 py-12">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-10 px-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" width={500} height={500} alt="Logo" />
        </div>

        <div className="text-white max-w-xl text-center md:text-left">
          <h2 className={`${creepster.className} text-6xl text-[#E92020] mb-3`}>DESCRIPTION</h2>
          <p className={`${irishGrover.className} text-2xl text-[#FFE1F9] mb-3`}>
            Kemilau Topeng presents quality masks with unique and authentic designs.
            We combine traditional and modern touches to create memorable works.
            Suitable for performances, special events, and decorations.
          </p>
        </div>
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-center items-start px-4 gap-4">
        <div className="hidden md:block h-full">
          <h2
            className={`${creepster.className} text-red-600 text-4xl leading-tight`}
            style={{ writingMode: 'vertical-lr', textOrientation: 'upright' }}>OUR ARTIST</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {teamMembers.map((member, index) => (
            <Team
              key={index}
              image={member.image}
              name={member.name}
              desc={member.desc}
            />
          ))}
        </div>

        <div className="mt-8 md:mt-0 md:ml-6 max-w-sm text-left">
          <h2 className={`${creepster.className} text-6xl text-[#E92020] text-center md:text-left mb-2`}>BACKGROUND</h2>
          <p className={`${irishGrover.className} text-2xl text-[#FFE1F9]`}>
            Kemilau Topeng product was developed in order to raise knowledge of traditional topeng among the general
            public. This product seeks to conserve culture and transmit it to future generations through an attractive
            design.
          </p>
        </div>
      </div>
    </div>
  );
}

function Team({ image, name, desc }: TeamMember) {
  return (
    <div
      className="relative bg-[#A64D79] p-4 rounded-xl shadow-2xl w-[250px] h-[420px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/bg profile klpok.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#A64D79] opacity-80"></div>
      <div className="w-full relative z-10 flex flex-col items-center justify-center">
        <Image src={image} width={200} height={200} className="rounded-full object-cover mb-2" alt={name} />
        <h3 className={`${irishGrover.className} mt-2 text-lg font-semibold text-white`}>{name}</h3>
        <p className={`${irishGrover.className} text-base mt-1 text-white text-center`}>{desc}</p>
      </div>
    </div>
  );
}