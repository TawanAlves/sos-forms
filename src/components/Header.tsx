'use client';

import { SosPalmilhasLogo } from './icons/SosPalmilhasLogo';

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`bg-white shadow-sm border-b py-4 ${className}`} style={{ borderColor: 'var(--color-slate-200)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <SosPalmilhasLogo
              width={56}
              height={32}
              className="flex-shrink-0"
            />
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-slate-700)' }}>
              Pedido de Palmilhas - SOSP3D
            </h1>
          </div>

          {/* Info adicional */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--color-slate-700)' }}>
                📞 (11) 97870‑2088
              </p>
              <p className="text-xs" style={{ color: 'var(--color-slate-500)' }}>
                Segunda a Sexta, 8h às 18h
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
