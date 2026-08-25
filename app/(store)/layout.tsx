import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WishlistProvider } from '@/lib/context/wishlist-context';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let profile = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = data;
    }
  } catch (error) {
    // Fail silently in development/guest mode
    console.error('Error fetching session in layout:', error);
  }

  return (
    <WishlistProvider>
      <div className="flex flex-col min-h-screen bg-[#080A13]">
        <Header profile={profile} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  );
}
