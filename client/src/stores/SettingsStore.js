import { observable } from 'mobx'

class SettingsStore {
     @observable darkMode = false;
     @observable chatNotifications = true;
}

const store = new SettingsStore();
export default store;