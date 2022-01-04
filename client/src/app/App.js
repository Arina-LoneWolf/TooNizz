import './App.scss';
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerGameWaiting from '../pages/PlayerGameWaiting';
import HostGamePlay from '../pages/HostGamePlay';
// import PlayerGamePlay from '../pages/PlayerGamePlay';
import Home from '../pages/Home';
import Authentication from '../pages/Authentication';
// import Editor from '../pages/Editor';
import Collection from '../pages/Collection';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Preloader from '../shared/Preloader';
import GetExchangeRates from './ExchangeRates';

const Entry = lazy(() => import('../pages/Entry'));
const HostGameWaiting = lazy(() => import('../pages/HostGameWaiting'));
const HostGameControl = lazy(() => import('../pages/HostGameControl'));
const PlayerGamePlay = lazy(() => import('../pages/PlayerGamePlay'));
const Editor = lazy(() => import('../pages/Editor'));
const LeaderBoard = lazy(() => import('../pages/LeaderBoard')); // tạm
const PlayerQuestionResult = lazy(() =>
	import('../pages/PlayerQuestionResult')
); // tạm
const HostQuestionResult = lazy(() => import('../pages/HostQuestionResult')); // tạm
const HostGameResult = lazy(() => import('../pages/HostGameResult')); // tạm
const PlayerGameResult = lazy(() => import('../pages/PlayerGameResult')); // tạm

const AccountInfo = lazy(() => import('../pages/AccountInfo'));

function App() {
	return (
		<Router>
			<Suspense fallback={<Preloader />}>
				<Routes>
					<Route path="/" element={<Entry />} />
					<Route path="/account-info" element={<AccountInfo />} />
					<Route path="/lobby" element={<PlayerGameWaiting />} />
					<Route path="/lobby/admin" element={<HostGameWaiting />} />
					<Route path="/gameplay" element={<PlayerGamePlay />} />
					{/* <Route path='/gameplay/admin/*' element={<HostGamePlay />} /> */}
					<Route path="/gameplay/admin" element={<HostGameControl />} />
					<Route path="/home" element={<Home />} />
					<Route
						path="/authentication/:formType"
						element={<Authentication />}
					/>
					<Route path="/editor" element={<Editor />} />
					<Route path="/collection" element={<Collection />} />
					<Route path="/reports" element={<Reports />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/get-exchange-rates" element={<GetExchangeRates />} />
					<Route path="/preloader" element={<Preloader />} />
					<Route path="leaders" element={<LeaderBoard />} />
					<Route path="q-result" element={<PlayerQuestionResult />} />
					<Route path="q-result/admin" element={<HostQuestionResult />} />
					<Route path="game-result/admin" element={<HostGameResult />} />
					<Route path="game-result" element={<PlayerGameResult />} />
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
