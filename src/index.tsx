import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Theme from './components/Theme';

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Automatically reload app if launching from homescreen.
const isInWebAppiOS = (window.navigator as any).standalone === true;
const isInWebAppChrome = window.matchMedia('(display-mode: standalone)')
  .matches;

if (isInWebAppiOS || isInWebAppChrome) {
  const dateOpened = new Date();
  window.addEventListener('focus', () => {
    const now = new Date();
    const oneMinute = 1000 * 60;
    if (+now - +dateOpened > oneMinute) {
      window.location.reload();
    }
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
