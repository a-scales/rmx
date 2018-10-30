import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import views from './Config/views';
import Store from './Store';
import {MobxRouter} from 'mobx-router'

let sr = Store.route();
sr(views.views,Store.appStore)

ReactDOM.render(
	    <Provider store={Store.appStore}>
      		<MobxRouter/>
      	</Provider>
      , document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();