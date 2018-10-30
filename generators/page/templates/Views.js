import React from 'react';
import {Route} from 'mobx-router';
import Home from '../Pages/Home';
class Views {
	constructor() {
		this.views = {
			home: new Route({
				path: '/',
				component: <Home/>
			})
		}
	}

}
export default new Views();
