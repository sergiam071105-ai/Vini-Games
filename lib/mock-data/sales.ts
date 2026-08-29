import { AdminOrder, FinancialKPIs, RevenueDataPoint, TimeRange } from '@/types/admin-sales.types';
import { MOCK_GAMES } from './games';

/**
 * 25 Órdenes de prueba transaccionales con fechas distribuidas a lo largo del año
 */
export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 1,
    orderCode: 'TX-8921',
    userId: 'usr-edu-01',
    username: 'Eduardo_Gamer',
    email: 'eduardo.ribera@utepsa.edu.bo',
    avatarUrl: null,
    subtotal: 270.00,
    discountTotal: 52.50,
    total: 217.50,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // Hace 35 min
    items: [
      {
        id: 101,
        gameId: 1,
        title: 'Cyberpunk 2077: Phantom Liberty',
        slug: 'cyberpunk-2077',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        developer: 'CD PROJEKT RED',
        unitPrice: 120.00,
        discountApplied: 30.00,
        finalPrice: 90.00,
      },
      {
        id: 102,
        gameId: 2,
        title: 'Elden Ring: Shadow of the Erdtree',
        slug: 'elden-ring',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
        developer: 'FromSoftware Inc.',
        unitPrice: 150.00,
        discountApplied: 22.50,
        finalPrice: 127.50,
      }
    ]
  },
  {
    id: 2,
    orderCode: 'TX-4310',
    userId: 'usr-vini-02',
    username: 'Vinicius_Lead',
    email: 'vinicius.montibeller@utepsa.edu.bo',
    avatarUrl: null,
    subtotal: 180.00,
    discountTotal: 0.00,
    total: 180.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Hace 3 horas
    items: [
      {
        id: 103,
        gameId: 4,
        title: 'Vortex Apex: Cyber Horizon',
        slug: 'vortex-apex-cyber-horizon',
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        developer: 'Apex Studio',
        unitPrice: 180.00,
        discountApplied: 0.00,
        finalPrice: 180.00,
      }
    ]
  },
  {
    id: 3,
    orderCode: 'TX-7744',
    userId: 'usr-shai-03',
    username: 'Shaimme_Pro',
    email: 'shaimme.zelada@utepsa.edu.bo',
    avatarUrl: null,
    subtotal: 310.00,
    discountTotal: 85.00,
    total: 225.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), // Hace 9 horas
    items: [
      {
        id: 104,
        gameId: 1,
        title: 'Cyberpunk 2077: Phantom Liberty',
        slug: 'cyberpunk-2077',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        developer: 'CD PROJEKT RED',
        unitPrice: 120.00,
        discountApplied: 30.00,
        finalPrice: 90.00,
      },
      {
        id: 105,
        gameId: 5,
        title: 'Elysium Legends: Reborn',
        slug: 'elysium-legends-reborn',
        coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
        developer: 'Elysium Interactive',
        unitPrice: 190.00,
        discountApplied: 55.00,
        finalPrice: 135.00,
      }
    ]
  },
  {
    id: 4,
    orderCode: 'TX-9012',
    userId: 'usr-jose-04',
    username: 'Jose_GamerMaster',
    email: 'jose.rios@utepsa.edu.bo',
    avatarUrl: null,
    subtotal: 110.00,
    discountTotal: 10.00,
    total: 100.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Hace 22 horas
    items: [
      {
        id: 106,
        gameId: 3,
        title: 'Hollow Abyss: Remnants',
        slug: 'hollow-abyss-remnants',
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        developer: 'Team Silk',
        unitPrice: 110.00,
        discountApplied: 10.00,
        finalPrice: 100.00,
      }
    ]
  },
  {
    id: 5,
    orderCode: 'TX-6520',
    userId: 'usr-sergio-05',
    username: 'Sergio_Gamer',
    email: 'sergio.alvarez@utepsa.edu.bo',
    avatarUrl: null,
    subtotal: 260.00,
    discountTotal: 40.00,
    total: 220.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(), // Hace 1.5 días
    items: [
      {
        id: 107,
        gameId: 6,
        title: 'Pixel Quest: Dimensional Warp',
        slug: 'pixel-quest-dimensional-warp',
        coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=800&q=80',
        developer: '8Bit Dreams',
        unitPrice: 100.00,
        discountApplied: 0.00,
        finalPrice: 100.00,
      },
      {
        id: 108,
        gameId: 7,
        title: 'Infernal Edge: Bloodlines',
        slug: 'infernal-edge-bloodlines',
        coverUrl: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?auto=format&fit=crop&w=800&q=80',
        developer: 'Dark Matter Studios',
        unitPrice: 160.00,
        discountApplied: 40.00,
        finalPrice: 120.00,
      }
    ]
  },
  {
    id: 6,
    orderCode: 'TX-3319',
    userId: 'usr-carlos-06',
    username: 'Carlos_Viper',
    email: 'carlos.viper@gmail.com',
    avatarUrl: null,
    subtotal: 90.00,
    discountTotal: 0.00,
    total: 90.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Hace 2 días
    items: [
      {
        id: 109,
        gameId: 1,
        title: 'Cyberpunk 2077: Phantom Liberty',
        slug: 'cyberpunk-2077',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        developer: 'CD PROJEKT RED',
        unitPrice: 90.00,
        discountApplied: 0.00,
        finalPrice: 90.00,
      }
    ]
  },
  {
    id: 7,
    orderCode: 'TX-1188',
    userId: 'usr-andrea-07',
    username: 'Andrea_Cyber',
    email: 'andrea.torres@outlook.com',
    avatarUrl: null,
    subtotal: 350.00,
    discountTotal: 70.00,
    total: 280.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.2).toISOString(), // Hace 3 días
    items: [
      {
        id: 110,
        gameId: 2,
        title: 'Elden Ring: Shadow of the Erdtree',
        slug: 'elden-ring',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
        developer: 'FromSoftware Inc.',
        unitPrice: 150.00,
        discountApplied: 22.50,
        finalPrice: 127.50,
      },
      {
        id: 111,
        gameId: 4,
        title: 'Vortex Apex: Cyber Horizon',
        slug: 'vortex-apex-cyber-horizon',
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        developer: 'Apex Studio',
        unitPrice: 200.00,
        discountApplied: 47.50,
        finalPrice: 152.50,
      }
    ]
  },
  {
    id: 8,
    orderCode: 'TX-5044',
    userId: 'usr-diego-08',
    username: 'Diego_Shadow',
    email: 'diego.shadow@gmail.com',
    avatarUrl: null,
    subtotal: 140.00,
    discountTotal: 0.00,
    total: 140.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // Hace 4 días
    items: [
      {
        id: 112,
        gameId: 8,
        title: 'Cyber Strike: Special Ops',
        slug: 'cyber-strike-special-ops',
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        developer: 'Strike Force',
        unitPrice: 140.00,
        discountApplied: 0.00,
        finalPrice: 140.00,
      }
    ]
  },
  {
    id: 9,
    orderCode: 'TX-2980',
    userId: 'usr-lucia-09',
    username: 'Lucia_Pixel',
    email: 'lucia.mendez@hotmail.com',
    avatarUrl: null,
    subtotal: 210.00,
    discountTotal: 30.00,
    total: 180.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5.5).toISOString(), // Hace 5.5 días
    items: [
      {
        id: 113,
        gameId: 6,
        title: 'Pixel Quest: Dimensional Warp',
        slug: 'pixel-quest-dimensional-warp',
        coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=800&q=80',
        developer: '8Bit Dreams',
        unitPrice: 90.00,
        discountApplied: 0.00,
        finalPrice: 90.00,
      },
      {
        id: 114,
        gameId: 1,
        title: 'Cyberpunk 2077: Phantom Liberty',
        slug: 'cyberpunk-2077',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        developer: 'CD PROJEKT RED',
        unitPrice: 120.00,
        discountApplied: 30.00,
        finalPrice: 90.00,
      }
    ]
  },
  {
    id: 10,
    orderCode: 'TX-9411',
    userId: 'usr-miguel-10',
    username: 'Miguel_GamerX',
    email: 'miguel.gamerx@gmail.com',
    avatarUrl: null,
    subtotal: 175.00,
    discountTotal: 25.00,
    total: 150.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6.8).toISOString(), // Hace ~7 días
    items: [
      {
        id: 115,
        gameId: 5,
        title: 'Elysium Legends: Reborn',
        slug: 'elysium-legends-reborn',
        coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
        developer: 'Elysium Interactive',
        unitPrice: 175.00,
        discountApplied: 25.00,
        finalPrice: 150.00,
      }
    ]
  },
  {
    id: 11,
    orderCode: 'TX-8102',
    userId: 'usr-valeria-11',
    username: 'Valeria_Rider',
    email: 'valeria.rider@gmail.com',
    avatarUrl: null,
    subtotal: 260.00,
    discountTotal: 45.00,
    total: 215.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(), // Hace 11 días
    items: [
      {
        id: 116,
        gameId: 2,
        title: 'Elden Ring: Shadow of the Erdtree',
        slug: 'elden-ring',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
        developer: 'FromSoftware Inc.',
        unitPrice: 150.00,
        discountApplied: 22.50,
        finalPrice: 127.50,
      },
      {
        id: 117,
        gameId: 3,
        title: 'Hollow Abyss: Remnants',
        slug: 'hollow-abyss-remnants',
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        developer: 'Team Silk',
        unitPrice: 110.00,
        discountApplied: 22.50,
        finalPrice: 87.50,
      }
    ]
  },
  {
    id: 12,
    orderCode: 'TX-7230',
    userId: 'usr-rodrigo-12',
    username: 'Rodrigo_Apex',
    email: 'rodrigo.apex@gmail.com',
    avatarUrl: null,
    subtotal: 190.00,
    discountTotal: 0.00,
    total: 190.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(), // Hace 16 días
    items: [
      {
        id: 118,
        gameId: 4,
        title: 'Vortex Apex: Cyber Horizon',
        slug: 'vortex-apex-cyber-horizon',
        coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        developer: 'Apex Studio',
        unitPrice: 190.00,
        discountApplied: 0.00,
        finalPrice: 190.00,
      }
    ]
  },
  {
    id: 13,
    orderCode: 'TX-6019',
    userId: 'usr-gabriela-13',
    username: 'Gaby_Gamer',
    email: 'gabriela.castro@gmail.com',
    avatarUrl: null,
    subtotal: 310.00,
    discountTotal: 60.00,
    total: 250.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(), // Hace 22 días
    items: [
      {
        id: 119,
        gameId: 1,
        title: 'Cyberpunk 2077: Phantom Liberty',
        slug: 'cyberpunk-2077',
        coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        developer: 'CD PROJEKT RED',
        unitPrice: 120.00,
        discountApplied: 30.00,
        finalPrice: 90.00,
      },
      {
        id: 120,
        gameId: 7,
        title: 'Infernal Edge: Bloodlines',
        slug: 'infernal-edge-bloodlines',
        coverUrl: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?auto=format&fit=crop&w=800&q=80',
        developer: 'Dark Matter Studios',
        unitPrice: 190.00,
        discountApplied: 30.00,
        finalPrice: 160.00,
      }
    ]
  },
  {
    id: 14,
    orderCode: 'TX-4890',
    userId: 'usr-fernando-14',
    username: 'Fer_Knight',
    email: 'fernando.knight@gmail.com',
    avatarUrl: null,
    subtotal: 130.00,
    discountTotal: 0.00,
    total: 130.00,
    paymentMethod: 'SIMULATED_CARD',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27).toISOString(), // Hace 27 días
    items: [
      {
        id: 121,
        gameId: 6,
        title: 'Pixel Quest: Dimensional Warp',
        slug: 'pixel-quest-dimensional-warp',
        coverUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=800&q=80',
        developer: '8Bit Dreams',
        unitPrice: 130.00,
        discountApplied: 0.00,
        finalPrice: 130.00,
      }
    ]
  }
];

/**
 * Calcula los KPIs financieros a partir de las órdenes disponibles
 */
export function calculateFinancialKPIs(orders: AdminOrder[] = MOCK_ADMIN_ORDERS): FinancialKPIs {
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  
  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const totalDiscounts = completedOrders.reduce((acc, o) => acc + o.discountTotal, 0);
  const averageTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const conversionRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0;

  return {
    totalRevenueMonthly: totalRevenue,
    revenueGrowthPercent: 18.4, // +18.4% vs mes anterior
    averageTicket: averageTicket,
    averageTicketGrowthPercent: 5.2, // +5.2%
    totalCompletedOrders: completedOrders.length,
    totalOrders: orders.length,
    totalDiscountsGiven: totalDiscounts,
    conversionRate: conversionRate,
  };
}

/**
 * Genera puntos de serie temporal para la gráfica de ingresos según el rango seleccionado
 */
export function getRevenueChartData(range: TimeRange, orders: AdminOrder[] = MOCK_ADMIN_ORDERS): RevenueDataPoint[] {
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const now = new Date();

  if (range === '7d') {
    // Últimos 7 días
    const points: RevenueDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('es-BO', { weekday: 'short', day: 'numeric', month: 'short' });
      
      const dayOrders = completedOrders.filter((o) => o.createdAt.startsWith(dateStr));
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);

      // Si es un día sin órdenes reales en el mock reciente, inyectamos una variación realista
      const revenue = dayRevenue > 0 ? dayRevenue : [180, 220, 90, 280, 150, 225, 397.5][6 - i];
      const count = dayOrders.length > 0 ? dayOrders.length : [1, 2, 1, 2, 1, 2, 3][6 - i];

      points.push({
        date: dateStr,
        label: dayName,
        revenue,
        ordersCount: count,
      });
    }
    return points;
  }

  if (range === '30d') {
    // Últimos 30 días agrupados en semanas/intervalos de 5 días
    const intervals = [
      { label: 'Semana 1 (Día 1-7)', revenue: 1420.50, count: 8 },
      { label: 'Semana 2 (Día 8-14)', revenue: 1680.00, count: 10 },
      { label: 'Semana 3 (Día 15-21)', revenue: 1290.00, count: 7 },
      { label: 'Semana 4 (Día 22-28)', revenue: 1940.00, count: 11 },
      { label: 'Últimos Días', revenue: 865.00, count: 5 },
    ];

    return intervals.map((item, idx) => ({
      date: `2026-08-W${idx + 1}`,
      label: item.label,
      revenue: item.revenue,
      ordersCount: item.count,
    }));
  }

  // Histórico Anual (12 Meses)
  const months = [
    { label: 'Sep 25', revenue: 4800, count: 32 },
    { label: 'Oct 25', revenue: 5600, count: 38 },
    { label: 'Nov 25', revenue: 7200, count: 49 },
    { label: 'Dic 25', revenue: 11400, count: 76 },
    { label: 'Ene 26', revenue: 6800, count: 44 },
    { label: 'Feb 26', revenue: 7900, count: 51 },
    { label: 'Mar 26', revenue: 8400, count: 56 },
    { label: 'Abr 26', revenue: 9100, count: 59 },
    { label: 'May 26', revenue: 8700, count: 55 },
    { label: 'Jun 26', revenue: 10200, count: 68 },
    { label: 'Jul 26', revenue: 11800, count: 79 },
    { label: 'Ago 26', revenue: 12640, count: 84 },
  ];

  return months.map((m) => ({
    date: m.label,
    label: m.label,
    revenue: m.revenue,
    ordersCount: m.count,
  }));
}
