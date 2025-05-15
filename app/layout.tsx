// app/layout.tsx
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import ClientWrapper from '@/components/ClientWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen relative">
          {/* Main Content */}
          <div className="flex-grow">
            <ClientWrapper>{children}</ClientWrapper>
          </div>
        </div>
      </body>
    </html>
  );
}