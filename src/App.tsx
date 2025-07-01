import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QAPage from './pages/QAPage';
import MythsPage from './pages/MythsPage';
import ResearchPage from './pages/ResearchPage';
import AgeGroupsPage from './pages/AgeGroupsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/myths" element={<MythsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/age-groups" element={<AgeGroupsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;