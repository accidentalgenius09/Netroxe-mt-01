
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Table from './components/Table';
import SectionDetails from './components/SectionDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/details/:id" element={<SectionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
