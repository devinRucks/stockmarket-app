import { observable } from 'mobx'
// import { createContext } from 'react';

class AccessoryStore {
     @observable displayError = false;
     @observable loading = false;
     @observable darkMode = false;
     @observable chatNotifications = true;
}

const store = new AccessoryStore();
export default store;
// export const AccessoryStoreContext = createContext(new AccessoryStore());