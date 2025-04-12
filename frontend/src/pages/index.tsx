import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>ProAgendify - Sistema de Agendamento para Profissionais</title>
        <meta
          name="description"
          content="ProAgendify - A solução completa de agendamentos para profissionais autônomos da área da beleza e estética."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                ProAgendify
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Acessar Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Simplifique seus agendamentos
              </h1>
              <p className="mt-6 text-xl max-w-3xl">
                ProAgendify é a solução completa para profissionais da beleza e estética gerenciarem
                seus agendamentos, clientes e serviços em um único lugar.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link
                  href="/register"
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Comece Agora
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-3 text-base font-medium rounded-md text-blue-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full opacity-50 filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600 rounded-full opacity-50 filter blur-3xl"></div>
                <div className="relative">
                  <img
                    className="rounded-lg shadow-xl"
                    src="https://via.placeholder.com/600x400?text=ProAgendify"
                    alt="Dashboard do ProAgendify"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Recursos</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tudo o que você precisa em um só lugar
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Gerencie seus agendamentos de forma simples e eficiente
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Agendamento Simplificado</h3>
                <p className="mt-2 text-gray-600">
                  Gerencie seus horários com facilidade e evite conflitos de agendamento
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Gestão de Clientes</h3>
                <p className="mt-2 text-gray-600">
                  Mantenha todo o histórico e informações de seus clientes em um só lugar
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Personalização</h3>
                <p className="mt-2 text-gray-600">
                  Configure seus serviços, preços e disponibilidade de acordo com suas necessidades
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-blue-200">Crie sua conta hoje mesmo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Comece Grátis
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white">ProAgendify</h3>
              <p className="mt-2 text-gray-300">
                A solução para profissionais da beleza e estética gerenciarem seus negócios
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Links Úteis</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-white">
                    Planos e Preços
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400">
              &copy; {new Date().getFullYear()} ProAgendify. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}