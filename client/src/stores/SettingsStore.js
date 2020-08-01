import { observable } from 'mobx'
import { createContext } from 'react'

class SettingsStore {
     @observable darkMode = false;
     @observable chatNotifications = true;
}

// const store = new SettingsStore();
// export default store;
export const SettingsStoreContext = createContext(new SettingsStore());