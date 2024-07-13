import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './tailwind.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';

axios.defaults.baseURL = 'https://game-store-server-seven.vercel.app';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <div className="mt-16"> {/* Adjusted margin to account for fixed navbar */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<div className="background-image"><Register /></div>} />
          <Route path='/login' element={<div className="background-image"><Login /></div>} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </UserContextProvider>
  );
}

export default App;
