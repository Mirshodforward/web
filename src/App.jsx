import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Payment from './Payment.jsx';
import Premum from './Premum.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            
            <Home />
          </>
        } />
        <Route path="/payment" element={<Payment />} />
        <Route path="/premum" element={<Premum />} />
        
      </Routes>
    </Router>
  );
}


export default App;


