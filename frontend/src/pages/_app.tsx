import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Log para diagnóstico
  useEffect(() => {
    console.log('App: Montado com sessão:', session);
  }, [session]);
  
  return (
    <SessionProvider 
      session={session}
      // Reduzir o intervalo de polling para sessão
      refetchInterval={5} // Verifica a cada 5 segundos
      refetchOnWindowFocus={true}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
