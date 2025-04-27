import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merchant from './Merchant';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Merchant />} />
        <Route path="/pay" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;