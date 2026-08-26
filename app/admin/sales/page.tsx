import { createClient } from '@/lib/supabase/server';
import { MOCK_ADMIN_ORDERS, calculateFinancialKPIs } from '@/lib/mock-data/sales';
import { AdminOrder, OrderItemDetail } from '@/types/admin-sales.types';
import { AdminSalesClientView } from '@/components/admin/admin-sales-client-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Auditoría de Ventas | ViniAdmin',
  description: 'Panel de auditoría transaccional, métricas financieras y exportación CSV de ViniGames.',
};

export default async function AdminSalesPage() {
  const supabase = await createClient();
  let orders: AdminOrder[] = MOCK_ADMIN_ORDERS;

  try {
    // Intentar consultar órdenes reales desde Supabase
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_code,
        user_id,
        subtotal,
        discount_total,
        total,
        payment_method,
        status,
        created_at,
        profiles (
          username,
          avatar_url
        ),
        order_items (
          id,
          game_id,
          unit_price,
          discount_applied,
          final_price,
          games (
            title,
            slug,
            cover_image_url,
            developer
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && dbOrders && dbOrders.length > 0) {
      orders = dbOrders.map((o: any) => {
        const items: OrderItemDetail[] = (o.order_items || []).map((it: any) => ({
          id: it.id,
          gameId: it.game_id,
          title: it.games?.title || 'Videojuego',
          slug: it.games?.slug || 'juego',
          coverUrl: it.games?.cover_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          developer: it.games?.developer || 'ViniGames Studio',
          unitPrice: Number(it.unit_price || 0),
          discountApplied: Number(it.discount_applied || 0),
          finalPrice: Number(it.final_price || 0),
        }));

        const uname = o.profiles?.username || 'Gamer Desconocido';
        const method = (o.payment_method === 'CARD' ? 'SIMULATED_CARD' : o.payment_method || 'SIMULATED_CARD');

        return {
          id: o.id,
          orderCode: o.order_code,
          userId: o.user_id,
          username: uname,
          email: `${uname.toLowerCase().replace(/\s+/g, '')}@vinigames.com`,
          avatarUrl: o.profiles?.avatar_url || null,
          subtotal: Number(o.subtotal),
          discountTotal: Number(o.discount_total || 0),
          total: Number(o.total),
          paymentMethod: method as any,
          status: (o.status || 'COMPLETED').toUpperCase() as any,
          createdAt: o.created_at,
          items,
        };
      });
    }
  } catch (err) {
    console.warn('Usando Mock Orders debido a fallback:', err);
  }

  const initialKpis = calculateFinancialKPIs(orders);

  return (
    <div className="w-full space-y-6">
      <AdminSalesClientView initialOrders={orders} initialKPIs={initialKpis} />
    </div>
  );
}
