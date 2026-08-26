import { createClient } from '@/lib/supabase/server';
import { MOCK_ADMIN_ORDERS, calculateFinancialKPIs } from '@/lib/mock-data/sales';
import { AdminOrder, OrderItemDetail } from '@/types/admin-sales.types';
import { AdminSalesClientView } from '@/components/admin/admin-sales-client-view';

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

        return {
          id: o.id,
          orderCode: o.order_code || `TX-${o.id.toString().padStart(4, '0')}`,
          userId: o.user_id,
          username: o.profiles?.username || 'Usuario_Gamer',
          email: `${o.profiles?.username || 'usuario'}@vinigames.com`,
          avatarUrl: o.profiles?.avatar_url || null,
          subtotal: Number(o.subtotal || 0),
          discountTotal: Number(o.discount_total || 0),
          total: Number(o.total || 0),
          paymentMethod: o.payment_method || 'SIMULATED_CARD',
          status: o.status || 'COMPLETED',
          createdAt: o.created_at,
          items: items,
        };
      });
    }
  } catch (err) {
    console.error('Error cargando órdenes de Supabase, usando respaldo mock:', err);
    orders = MOCK_ADMIN_ORDERS;
  }

  const kpis = calculateFinancialKPIs(orders);

  return (
    <AdminSalesClientView
      initialOrders={orders}
      initialKPIs={kpis}
    />
  );
}
