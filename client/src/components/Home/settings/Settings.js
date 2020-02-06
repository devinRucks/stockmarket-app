import React from 'react';
import './settings.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons'
import Switch from 'react-switch'

export default class Settings extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               displaySettingsMenu: false,
               darkMode: false
          }
     }

     // componentDidMount() {
     //      this.props.darkMode(this.state.darkMode)
     // }

     handleSettingsMenuDisplay() {
          this.setState(prevState => ({
               displaySettingsMenu: !prevState.displaySettingsMenu
          }))
          console.log("Settings clicked")
     }

     handleDarkModeChange() {
          this.setState((prevState) => ({
               darkMode: !prevState.darkMode
          }), () => this.props.darkMode(this.state.darkMode))
     }


     render() {
          const { displaySettingsMenu, darkMode } = this.state;
          return (
               <>
                    <div className="settings-btn" onClick={() => this.handleSettingsMenuDisplay()}>
                         <FontAwesomeIcon icon={faCog} />
                    </div>
                    <div id="settings-sidebar" style={{ right: displaySettingsMenu ? '0' : '-300px' }}>
                         <header id="settings-header-container">
                              <div className="close-btn" onClick={() => this.handleSettingsMenuDisplay()}>
                                   <FontAwesomeIcon icon={faTimes} size="2x" />
                              </div>
                              <div className="settings-title">Settings</div>
                         </header>

                         <section id="settings-content-container">
                              <div className="setting">
                                   <div className="setting-description">Dark Mode</div>
                                   <div className="setting-toggle">
                                        <Switch
                                             checked={darkMode}
                                             onChange={() => this.handleDarkModeChange()}
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
     }
}
