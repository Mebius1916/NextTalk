import React from 'react';
import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider, ToastProvider } from '@apideck/components'
export default function MyApp({ Component, pageProps }:any) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page:any) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <ToastProvider>
          <ModalProvider>
            {getLayout(<Component {...pageProps} />)}
          </ModalProvider>
        </ToastProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
