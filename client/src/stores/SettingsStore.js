import { observable } from 'mobx'
import { createContext } from 'react'

class SettingsStore {
     @observable darkMode = false;
     @observable chatNotifications = true;
}

export const SettingsStoreContext = createContext(new SettingsStore());