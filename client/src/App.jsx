import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './tailwind.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = 'https://game-store-server-seven.vercel.app/';
axios.defaults.withCredentials = true;

function App() {
  const isUserSignedIn = !!localStorage.getItem('token');

  return (
    <div>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<div className="background-image"><Register /></div>} />
        <Route path='/login' element={<div className="background-image"><Login /></div>} />
        {isUserSignedIn && <Route path='/account' element={<Account />} />}
      </Routes>
    </div>
  );
}

export default App;
