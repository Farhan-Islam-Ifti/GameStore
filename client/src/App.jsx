import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
//import Account from './pages/Account';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const isUserSignedIn = !!localStorage.getItem('token');

  return (
    <div className="app-container">
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {isUserSignedIn && <Route path='/account' element={<Account />} />}
      </Routes>
    </div>
  );
}

export default App;
