import { observable } from 'mobx'
import { createContext } from 'react';

class AccessoryStore {
     @observable displayError = false;
     @observable loading = false;
     @observable darkMode = false;
     @observable chatNotifications = true;
}


export const AccessoryStoreContext = createContext(new AccessoryStore());