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
import { retrieveCurrentDate, retrievePrevMonthDate } from '../../utils/functions'
import { observer, inject } from 'mobx-react';


const Home = inject('GraphInfoStore', 'AccessoryStore')(observer((props) => {
	const [inputValue, setInputValue] = useState('');
	const [currentCompany, setCurrentCompany] = useState('');
	const [loading, setLoading] = useState(false);
	const [addToWatchlistVal, setAddToWatchlistVal] = useState('');
	const { GraphInfoStore } = props;
	const { AccessoryStore } = props;

	useEffect(() => {
		GraphInfoStore.currentDate = retrieveCurrentDate();
		GraphInfoStore.prevMonthDate = retrievePrevMonthDate();
	});

	/**
	 * Gets stock data from API. If error in API call, displays error message
	 */
	const getData = () => {
		setLoading(true);

		axios.post('/getData', {
			stockSymbol: currentCompany,
			currentDate: GraphInfoStore.currentDate,
			prevMonthDate: GraphInfoStore.prevMonthDate
		})
			.then(res => res.data)
			.then(data => {
				GraphInfoStore.graphData = data.dataForGraph;
				AccessoryStore.displayError = false;
				setLoading(false);
				setInputValue('')
			})
			.catch(err => {
				console.log(err)
				GraphInfoStore.graphData = {};
				AccessoryStore.displayError = true;
				setLoading(false);
				setInputValue('')
			})
	}

	// const useMountEffect = (func) => useEffect(func, [currentCompany], [])
	// useMountEffect(getData)

	// Every time setCurrentCompany changes, getData will be called
	useEffect(() => {
		getData();
	}, [currentCompany])

	// On Submit Button 
	const handleClick = () => {
		// Checks to make sure user has typed something in search field.
		if (inputValue !== '') {
			setCurrentCompany(inputValue);
			getData();
		}

	}

	/**
	 * Callback function from Watchlist component. 
	 * @param {string} companyClicked - company that was clicked
	 */
	const updateCurrentCompany = (companyClicked) => {
		setInputValue('')
		setCurrentCompany(companyClicked);
		setLoading(true);
		handleClick();
	}


	// called when the add to watchlist button is clicked
	// const addToWatchlist = () => {
	//      setAddToWatchlistVal(currentCompany)
	//      axios.post('/addToWatchlist', { company: currentCompany })
	// }

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
							{AccessoryStore.displayError &&
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
					{!AccessoryStore.displayError &&
						<>
							<div className="current-company">
								{currentCompany}
							</div>
							<div className="add-to-watchlist">
								{/* <div className="icon" onClick={addToWatchlist()}>
                                             <FontAwesomeIcon icon={faPlusCircle} />
                                        </div> */}
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
				<Chat allowChatNotifications={AccessoryStore.chatNotifications} />
			</footer>
		</div>
	);
}));

export default Home;