import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentPage from './components/PaymentPage'; // Import halaman pembayaran

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routing untuk halaman pembayaran */}
        <Route path="/pay" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
};

export default App;