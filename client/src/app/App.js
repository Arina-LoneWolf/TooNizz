import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Entry from '../pages/Entry';
import PlayerGameWaiting from '../pages/PlayerGameWaiting';
import HostGameWaiting from '../pages/HostGameWaiting';
import Home from '../pages/Home';
import Authentication from '../pages/Authentication';
import Creator from '../pages/Creator';
import Collections from '../pages/Collections';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import GetExchangeRates from './ExchangeRates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Entry />} />
        <Route path='/lobby' element={<PlayerGameWaiting />} />
        <Route path='/lobby/admin' element={<HostGameWaiting />} />
        <Route path='/home' element={<Home />} />
        <Route path='/authentication/:formType' element={<Authentication />} />
        <Route path='/creator' element={<Creator />} />
        <Route path='/collections' element={<Collections />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/get-exchange-rates' element={<GetExchangeRates />} />
      </Routes>
    </Router>
  );
}

export default App;
