import React, { useEffect, useState } from 'react';
import './Home.scss';
import Chart from './chart/Chart'
import Watchlist from './watchlist/Watchlist'
import Chat from './chat/Chat'
import Settings from './settings/Settings'
import axios from 'axios'
import logo from '../../utils/title-img.png'
import * as utils from '../../utils/styling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faExclamationCircle, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Loading from '../Loading/Loading'
import { observer, inject } from 'mobx-react';

// TODO:
// - Add WatchlistStore
// - Add CompanyStore
// - Change all child components to functional
// - Convert Watchlist Component to implement stores.

const Home = inject('GraphInfoStore', 'SettingsStore', 'WatchlistStore')(observer((props) => {
	const [inputValue, setInputValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(false);
	const { GraphInfoStore } = props;
	const { SettingsStore } = props;
	const { WatchlistStore } = props;

	useEffect(() => {
		GraphInfoStore.setStartDate();
		GraphInfoStore.setEndDate();
	});

	/**
	 * Gets stock data from API. If error in API call, displays error message
	 */
	const getData = () => {
		setLoading(true);

		axios.post('/getData', {
			stockSymbol: GraphInfoStore.currentCompany,
			currentDate: GraphInfoStore.endDate,
			prevMonthDate: GraphInfoStore.startDate
		})
			.then(res => res.data)
			.then(data => {
				GraphInfoStore.graphData = data.dataForGraph;
				setErrorMsg(false);
				setLoading(false);
				setInputValue('')
			})
			.catch(err => {
				console.log(err)
				GraphInfoStore.graphData = {};
				setErrorMsg(true);
				setLoading(false);
				setInputValue('')
			})
	}


	/**
	 * Every time currentCompany changes, getData will be called
	 */
	useEffect(() => {
		getData();
	}, [GraphInfoStore.currentCompany])



	/**
	 * Called when submit button is clicked
	 */
	const handleClick = () => {
		GraphInfoStore.setCurrentCompany(inputValue)
		getData();
	}


	/**
	 * Callback function from Watchlist component. 
	 * @param {string} companyClicked - company that was clicked
	 */
	// const updateCurrentCompany = (companyClicked) => {
	// 	setInputValue('')
	// 	setCurrentCompany(companyClicked);
	// 	setLoading(true);
	// 	handleClick();
	// }


	/**
	 * Called when add to watchlist button is clicked
	 */
	const addToWatchlist = () => {
		WatchlistStore.addToWatchlist(GraphInfoStore.currentCompany)
	}

	const logout = () => {
		axios.get('/logoutUser')
	}

	return (
		<div className="App">

			<header id="header-container">

				<div id="logo-container">
					<img className="title-img" src={logo} alt={"title img"} height="45" width="60"></img>
					<h1 className="logoTxt">StockData</h1>
				</div>

				<div id="nav-container">
					<section id="logout-settings-container">
						<Settings />
						<Link to='/'>
							<div className="logout-btn">
								<FontAwesomeIcon
									onClick={logout}
									icon={faSignOutAlt} />
							</div>
						</Link>
					</section>

					<section id="search-container">
						<div id="error-container">
							{errorMsg &&
								<>
									<div className="error-icon">
										<FontAwesomeIcon icon={faExclamationCircle} />
									</div>
									<div className="error-msg">Invalid Company</div>
								</>
							}
						</div>

						<input className="searchTxt"
							onChange={e => setInputValue(e.target.value)}
							value={inputValue} />

						<div id="submit-loading-container">
							<button className="submit"
								style={{ display: loading ? 'none' : 'block' }}
								onClick={handleClick}> <FontAwesomeIcon icon={faSearch} /> </button>
							<div className="loading-symbol">
								{loading && <Loading type={'spokes'} color={'#FFFFFF'} />}
							</div>
						</div>
					</section>
				</div>
			</header>

			<div id="content-container">
				<section id="watchlist-container">
					<Watchlist />
				</section>

				<section id="action-container">
					{!errorMsg &&
						<>
							<div className="current-company">
								{GraphInfoStore.currentCompany}
							</div>
							<div className="add-to-watchlist">
								<div className="icon" onClick={addToWatchlist}>
									<FontAwesomeIcon icon={faPlusCircle} />
								</div>
								<div className="msg"> Add To Watchlist </div>
							</div>
						</>
					}
				</section>

				<section id="chart-container">
					<Chart data={GraphInfoStore.graphData} loading={loading} />
				</section>
			</div>
			<footer id="footer">
				<Chat allowChatNotifications={SettingsStore.chatNotifications} />
			</footer>
		</div>
	);
}));

export default Home;