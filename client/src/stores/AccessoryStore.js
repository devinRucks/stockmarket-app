import { observable } from 'mobx-react-lite'

class AccessoryStore {
     @observable displayError = false;
     @observable loading = false;
     @observable darkMode = false;
     @observable chatNotifications = true;
}


export const AccessoryStoreContext = createContext(new AccessoryStore());