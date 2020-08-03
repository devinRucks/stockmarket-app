import { observable, action } from 'mobx'
import { createContext } from 'react'

class SettingsStore {
     @observable darkMode = false;
     @observable allowChatNotifications = true;
     @observable displaySettingsMenu = false;

     @action
     setDarkMode = () => {
          this.darkMode = !this.darkMode
     }

     @action
     setChatNotifications = () => {
          this.allowChatNotifications = !this.allowChatNotifications;
     }

     @action
     setDisplaySettingsMenu = () => {
          this.displaySettingsMenu = !this.displaySettingsMenu;
     }
}

export const SettingsStoreContext = createContext(new SettingsStore());