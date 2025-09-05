'use client';

import React from 'react';
import { SosPalmilhasLogo } from './icons/SosPalmilhasLogo';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="mr-3 p-2 bg-white rounded-lg shadow-sm">
                  <SosPalmilhasLogo
                    width={48}
                    height={28}
                    className="flex-shrink-0"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">SOS Palmilhas</h3>
                  <p className="text-blue-200 text-sm font-medium">Pedido de Palmilhas - SOSP3D</p>
                </div>
              </div>
              <p className="text-blue-100 mb-4 max-w-md">
                Especialistas em palmilhas ortopédicas personalizadas.
                Oferecemos soluções inovadoras para o cuidado dos seus pés
                com tecnologia de ponta e atendimento especializado.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Links */}
                <Link
                  href="https://wa.me/5511978702088"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488" />
                  </svg>
                </Link>

                <Link
                  href="https://www.facebook.com/sospalmilha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>

                <Link
                  href="https://www.youtube.com/channel/UCKQMMJVkgyqknse3VctEJeQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>

                <Link
                  href="https://www.instagram.com/sospalmilhas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.548 14.264c.543.464 1.297.774 2.138.774c1.916 0 3.47-1.554 3.47-3.47s-1.554-3.47-3.47-3.47s-3.47 1.554-3.47 3.47c0 .309.042.608.123.893l-1.417 1.417C3.644 12.663 3.5 11.85 3.5 11.987c0-4.703 3.814-8.517 8.517-8.517s8.517 3.814 8.517 8.517s-3.814 8.517-8.517 8.517c-1.378 0-2.681-.33-3.83-.917l1.279-1.279c.774.309 1.626.494 2.551.494c3.47 0 6.284-2.814 6.284-6.284s-2.814-6.284-6.284-6.284s-6.284 2.814-6.284 6.284c0 1.297.402 2.499 1.081 3.502L8.449 16.988z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-blue-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">São Paulo, SP</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm">(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm">contato@sospalmilhas.com.br</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-blue-800 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-100 text-sm mb-2 md:mb-0">
              ©{currentYear} SOS Palmilhas - Todos os direitos reservados
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Termos de Uso
                </Link>
              </div>
              <div className="text-blue-200 text-xs">
                Desenvolvido com 💜 pela{' '}
                <Link
                  href="https://codei.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-purple-300 transition-colors font-medium"
                >
                  Codei Tecnologia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
