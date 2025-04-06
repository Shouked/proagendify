import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>ProAgendify - Sistema para Profissionais Autônomos</title>
        <meta name="description" content="Sistema SaaS para profissionais autônomos da área da beleza/estética" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Bem-vindo ao <span className="text-blue-600">ProAgendify</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema SaaS para profissionais autônomos da área da beleza/estética
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/login"
            className="px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrar
          </a>
        </div>
      </main>

      <footer className="w-full py-6 border-t border-gray-200 text-center text-gray-500">
        <p>© {new Date().getFullYear()} ProAgendify. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
