import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merchant from './Merchant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Merchant />} />
      </Routes>
    </Router>
  );
}

export default App;