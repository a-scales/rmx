import { RouterStore, startRouter} from 'mobx-router';
import {Views} from '../Config/views'

class RootStore {
	constructor() {
		this.appStore = new AppStore(this)
	}	
	route() {
		return(startRouter);
	}	
}


class AppStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.router = new RouterStore();
    }
}

export default new RootStore(); 