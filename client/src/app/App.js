import './App.scss';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerGameWaiting from '../pages/PlayerGameWaiting';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Authentication from '../pages/Authentication';
// import Editor from '../pages/Editor';
import Collection from '../pages/Collection';
import Reports from '../pages/Reports';
import ReportDetail from '../pages/ReportDetail';
import Viewer from '../pages/Viewer';
import Settings from '../pages/Settings';
import Dialog from '../shared/Dialog';
import Preloader from '../shared/Preloader';

const Entry = lazy(() => import('../pages/Entry'));
const HostGameWaiting = lazy(() => import('../pages/HostGameWaiting'));
const HostGameControl = lazy(() => import('../pages/HostGameControl'));
const PlayerGamePlay = lazy(() => import('../pages/PlayerGamePlay'));
const Editor = lazy(() => import('../pages/Editor'));

function App() {
  return (
    <Router>
      <Suspense fallback={<Preloader />}>
        <Routes>
          <Route path='/' element={<Entry />} />
          <Route path='/lobby' element={<PlayerGameWaiting />} />
          <Route path='/lobby/admin/:code' element={<HostGameWaiting />} />
          <Route path='/gameplay' element={<PlayerGamePlay />} />
          <Route path='/gameplay/admin' element={<HostGameControl />} />
          <Route path='/home' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/authentication/:formType' element={<Authentication />} />
          <Route path='/editor' element={<Editor />} />
          <Route path='/viewer/:id' element={<Viewer />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/reports/detail/:id' element={<ReportDetail />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/preloader' element={<Preloader />} />
        </Routes>
        <Dialog />
      </Suspense>
    </Router>
  );
}

export default App;
