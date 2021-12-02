import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
// import App from './app/App';
import Preloader from './shared/Preloader'
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token')
  }
});

const App = lazy(() => import('./app/App'));

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Suspense fallback={<Preloader />}>
        <App />
      </Suspense>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
