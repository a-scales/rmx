import { RouterStore, startRouter} from 'mobx-router';
import {Views} from '../Config/views'

class Store {
	constructor() {
		this.store = {
			app: {
				title: 'New Project',
				user: null
			},
			router: new RouterStore()
		}
	}	
	route() {
		// console.log(startRouter);
		return(startRouter);
	}	
}

export default new Store(); 