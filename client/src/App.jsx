import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Page from './pages/Page.jsx' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
      </Routes>
    </Router>
  );
}

export default App
