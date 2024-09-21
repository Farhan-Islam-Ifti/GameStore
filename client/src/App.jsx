import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './tailwind.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import PaymentSuccess from './components/PaymentSuccess';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import MyProfile from './components/MyProfile'
import ProductDetails from './components/ProductDetails';
import { PrivateRoute } from './context/auths';

axios.defaults.baseURL = 'https://game-store-server-jet.vercel.app';
axios.defaults.withCredentials = true;

function App() {
  const isUserSignedIn = !!localStorage.getItem('token');

  return (
    <div>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/*' element={<Home />} />
        <Route path='/register' element={<div className="background-image"><Register /></div>} />
        <Route path='/login' element={<div className="background-image"><Login /></div>} />
        {isUserSignedIn && <Route path='/account' element={<Account />} />}
        <Route path='/cart' element={ <PrivateRoute><Cart /></PrivateRoute>} />
        <Route path='/payment' element={<PrivateRoute><PaymentPage /></PrivateRoute>} /> {/* Fixed */}
        <Route path='/payment-success' element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/games/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
