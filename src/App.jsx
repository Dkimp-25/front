import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AvailableBooks from './components/AvailableBooks';
import AdminLogin from './components/auth/AdminLogin';
import AdminSignup from './components/auth/AdminSignup';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientLogin from './components/auth/ClientLogin';
import ClientSignup from './components/auth/ClientSignup';
import ClientDashboard from './components/client/ClientDashboard';
import SellBook from './components/SellBook';
import MyBooks from './components/MyBooks';
import LandingPage from './components/LandingPage';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books" element={<AvailableBooks />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Client Routes */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/signup" element={<ClientSignup />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/sell-book" element={<SellBook />} />
          <Route path="/my-books" element={<MyBooks />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
