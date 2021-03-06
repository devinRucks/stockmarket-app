import React from 'react';
import './App.scss';
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import withAuth from './components/ProtectedRoute/Protected-Route';
// import { Provider } from 'mobx-react'
// import GraphInfoStore from './stores/GraphInfoStore'
// import SettingsStore from './stores/SettingsStore';
// import WatchlistStore from './stores/WatchlistStore'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		return (
			< Router>
				<div className="App">
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path='/home' component={withAuth(Home)} />
						<Route path="/register" component={Register} />
						<Route path="*" component={() => "404 NOT FOUND"} />
					</Switch>
				</div>
			</Router>
		);
	}
}
