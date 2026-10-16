import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { ToastProvider } from './components/common/Toast'
import Home from './pages/Home'

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <CartProvider>
          <Home />
        </CartProvider>
      </ToastProvider>
    </LanguageProvider>
  )
}
