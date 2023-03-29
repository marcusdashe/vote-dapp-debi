import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Alert from '../components/Alert'
import { Toaster } from 'react-hot-toast';

const toastOptions = {  
  duration: 3000,
  position: 'top-center',
  style: {
    padding: '8px 8px 8px 16px',
    color: '#FFFFFF',
    borderRadius: '4px',
  },
  success: {
    style: {
      background: '#039855',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#039855',
    },
  },
  error: {
    style: {
      background: '#D92D20',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#D92D20',
    },
  },
}

const { chains, provider, webSocketProvider } = configureChains(
  [
    polygonMumbai
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: 'IJtnJ4HYZXb0fXRm8grPnrCFGnyL7Z4X',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div  className='h-screen bg-vote-50 pb-12 relative'>
          <Nav />
          <div className='w-11/12 md:w-6/12 mx-auto py-12'>
            
            <Component {...pageProps} />

            <Toaster toastOptions={toastOptions} />
          </div>
          <Footer />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
