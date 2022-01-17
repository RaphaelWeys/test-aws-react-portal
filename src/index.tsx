import 'antd/dist/antd.css';
import 'es6-shim';
import 'react-phone-input-2/lib/style.css';
import './i18n';

import LogRocket from 'logrocket';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(process.env.REACT_APP_LOG_ROCKET);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
