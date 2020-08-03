import React, { useContext } from 'react';
import './Settings.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons'
import Switch from 'react-switch'
import { observer } from 'mobx-react';
import { SettingsStoreContext } from '../../stores/SettingsStore'

const Settings = observer(() => {
     const SettingsStore = useContext(SettingsStoreContext)

     return (
          <>
               <div className="settings-btn" onClick={SettingsStore.setDisplaySettingsMenu}>
                    <FontAwesomeIcon icon={faCog} />
               </div>
               <div id="settings-sidebar" style={{ right: SettingsStore.displaySettingsMenu ? '0' : '-300px' }}>
                    <header id="settings-header-container">
                         <div className="close-btn" onClick={SettingsStore.setDisplaySettingsMenu}>
                              <FontAwesomeIcon icon={faTimes} size="2x" />
                         </div>
                         <div className="settings-title">Settings</div>
                    </header>

                    <section id="settings-content-container">
                         <div className="setting">
                              <div className="setting-description">Dark Mode</div>
                              <div className="setting-toggle">
                                   <Switch
                                        checked={SettingsStore.darkMode}
                                        onChange={SettingsStore.setDarkMode}
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={30}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                   />
                              </div>
                         </div>
                         <div className="setting">
                              <div className="setting-description">Chat Notifications</div>
                              <div className="setting-toggle">
                                   <Switch
                                        checked={SettingsStore.chatNotifications}
                                        onChange={SettingsStore.setChatNotifications}
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={30}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                   />
                              </div>
                         </div>
                    </section>
               </div>
          </>
     )
});

export default Settings;
