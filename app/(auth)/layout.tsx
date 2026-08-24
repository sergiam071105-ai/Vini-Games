import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full bg-[#080A13] text-[#F5F7FF] font-sans antialiased">
      {children}
    </div>
  );
}
