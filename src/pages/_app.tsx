import '@/styles/globals.css';
import 'react-contexify/ReactContexify.css';
import 'rc-tooltip/assets/bootstrap_white.css';

import { ChakraProvider } from '@chakra-ui/react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { AppProps } from 'next/app';
import Player from '@/components/playbar/Player';
import Head from 'next/head';
import { Database } from '@/supabase';

export default function App({ Component, pageProps }: AppProps) {

	const [supabaseClient] = useState(() => createPagesBrowserClient<Database>());

	return (
		<RecoilRoot>
			<Head>
				<title>Supafy</title>
				<meta property="og:title" content="Supafy" key="title" />
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
				<ChakraProvider >
					<Player />
					<Component {...pageProps} />
				</ChakraProvider>
			</SessionContextProvider>
		</RecoilRoot>
	)
}