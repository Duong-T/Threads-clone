import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'

const styles = {
  global: (props) => ({
    body: {
      color: mode('black', 'whiteAlpha.900')(props),
      bg: mode('white', 'black')(props),
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
}

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e"
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode renders every components twice, on development
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)
