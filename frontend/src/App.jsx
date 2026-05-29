import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import AddToCartFly from './components/AddToCartFly'
import CartToast from './components/CartToast'
import CheckoutSuccessModal from './components/CheckoutSuccessModal'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'
import PageLayout from './components/PageLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <Router>
      <CartProvider>
        <AddToCartFly />
        <CartToast />
        <CheckoutSuccessModal />
        <ProductModal />
        <CartDrawer />
        <WishlistDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PageLayout>
                <LoginPage />
              </PageLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PageLayout>
                <SignupPage />
              </PageLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PageLayout maxWidth="max-w-3xl">
                <ProfilePage />
              </PageLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageLayout maxWidth="max-w-4xl">
                <CheckoutPage />
              </PageLayout>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  )
}

export default App
