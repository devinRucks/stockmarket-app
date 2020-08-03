import { observable, action } from 'mobx'
import { createContext } from 'react'

class SettingsStore {
     @observable darkMode = false;
     @observable chatNotifications = true;
     @observable displaySettingsMenu = false;

     @action
     setDarkMode = () => {
          this.darkMode = !this.darkMode
     }

     @action
     setChatNotifications = () => {
          this.chatNotifications = !this.chatNotifications;
     }

     @action
     setDisplaySettingsMenu = () => {
          this.displaySettingsMenu = !this.displaySettingsMenu;
     }
}

export const SettingsStoreContext = createContext(new SettingsStore());