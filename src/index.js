import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

const rootEl = document.getElementById('root');

let render = () => {
  ReactDOM.render(<App />, rootEl);
};

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./app/layout/App', () => {
    setTimeout(render);
  });
}

render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();