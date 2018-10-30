import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import views from './Config/views';
import Store from './Store';
import {MobxRouter} from 'mobx-router'

let sr = Store.route();
console.log(sr);
sr(views.views,Store.store)

ReactDOM.render(
	    <Provider store={Store.store}>
      		<MobxRouter/>
      	</Provider>
      , document.getElementById('root'));
registerServiceWorker();