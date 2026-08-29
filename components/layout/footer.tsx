import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1C2B] border-t border-[#2D3349] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Credits */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity select-none mb-1 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="ViniGames Logo" 
                width={110}
                height={62}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#949CB2]">
              Desarrollado para la materia de Desarrollo de Aplicaciones Web
            </p>
            <p className="text-[10px] text-[#949CB2]/60 mt-1">
              © {new Date().getFullYear()} ViniGames. Todos los derechos reservados.
            </p>
          </div>

          {/* Academic Info */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1">
            <span className="text-xs font-semibold text-[#1FD1EB]">
              Universidad Tecnológica Privada de Santa Cruz
            </span>
            <span className="text-[11px] text-[#949CB2]">
              Facultad de Tecnología — Ingeniería en Sistemas
            </span>
            <div className="flex gap-2 mt-2 text-[10px] text-[#949CB2]/80">
              <span>V. Montibeller</span>•
              <span>S. Alvarez</span>•
              <span>S. Zelada</span>•
              <span>E. Ribera</span>•
              <span>J. Rios</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
