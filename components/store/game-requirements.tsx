export function GameRequirements() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Requisitos Mínimos */}
      <div className="bg-[#151722] rounded-xl p-6 border border-transparent">
        <h3 className="text-[#1FD1EB] font-semibold text-lg mb-4">Requisitos Mínimos</h3>
        <ul className="space-y-3 text-sm">
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">SO:</span>
            <span className="col-span-2 text-zinc-300">Windows 10 64-bit</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Procesador:</span>
            <span className="col-span-2 text-zinc-300">Intel Core i5-8400 / AMD Ryzen 3 3300X</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Memoria:</span>
            <span className="col-span-2 text-zinc-300">8 GB de RAM</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Gráficos:</span>
            <span className="col-span-2 text-zinc-300">NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">DirectX:</span>
            <span className="col-span-2 text-zinc-300">Versión 12</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Almacenamiento:</span>
            <span className="col-span-2 text-zinc-300">85 GB de espacio disponible (SSD recomendado)</span>
          </li>
        </ul>
      </div>

      {/* Requisitos Recomendados */}
      <div className="bg-[#151722] rounded-xl p-6 border border-transparent">
        <h3 className="text-[#783DF2] font-semibold text-lg mb-4">Requisitos Recomendados</h3>
        <ul className="space-y-3 text-sm">
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">SO:</span>
            <span className="col-span-2 text-zinc-300">Windows 10 / 11 64-bit</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Procesador:</span>
            <span className="col-span-2 text-zinc-300">Intel Core i7-10700K / AMD Ryzen 7 5800X</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Memoria:</span>
            <span className="col-span-2 text-zinc-300">16 GB de RAM</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Gráficos:</span>
            <span className="col-span-2 text-zinc-300">NVIDIA GeForce RTX 3070 / AMD Radeon RX 6800 XT</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">DirectX:</span>
            <span className="col-span-2 text-zinc-300">Versión 12</span>
          </li>
          <li className="grid grid-cols-3 gap-4">
            <span className="text-zinc-500 font-semibold">Almacenamiento:</span>
            <span className="col-span-2 text-zinc-300">85 GB de espacio disponible (SSD Requerido)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
