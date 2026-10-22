import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { ToastProvider } from './components/common/Toast'
import Home from './pages/Home'
import Admin from './pages/Admin'

const isAdminRoute =
  window.location.pathname.replace(import.meta.env.BASE_URL, '').replace(/\/$/, '') === 'admin'

export default function App() {
  if (isAdminRoute) {
    return (
      <ToastProvider>
        <Admin />
      </ToastProvider>
    )
  }

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
