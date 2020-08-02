import React, { useEffect, useContext } from 'react';
import './Home.scss';
import Chart from './Chart'
import Watchlist from './Watchlist'
import Chat from './Chat'
import Header from './Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react';
import { GraphInfoStoreContext } from '../../stores/GraphInfoStore'
import { WatchlistStoreContext } from '../../stores/WatchlistStore'
import { SettingsStoreContext } from '../../stores/SettingsStore'
import { UtilityStoreContext } from '../../stores/UtilityStore'

// TODO:
// - Create Header component to clean up jsx
// - Change all child components to functional
// - Move setStartDate and setEndDate into constructor of GraphInfoStore

const Home = observer(() => {
	const GraphInfoStore = useContext(GraphInfoStoreContext)
	const WatchlistStore = useContext(WatchlistStoreContext)
	const SettingsStore = useContext(SettingsStoreContext)
	const UtilityStore = useContext(UtilityStoreContext)


	useEffect(() => {
		GraphInfoStore.setStartDate();
		GraphInfoStore.setEndDate();
	}, [GraphInfoStore]);


	/**
	 * Called when add to watchlist button is clicked
	 */
	const addToWatchlist = () => {
		WatchlistStore.addToWatchlist(GraphInfoStore.currentCompany)
	}


	return (
		<div className="App">
			< Header />
			<div id="content-container">
				<Watchlist />

				<section id="action-container">
					{!UtilityStore.errorMsg &&
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

				<Chart data={GraphInfoStore.graphData} loading={UtilityStore.loading} />

			</div>
			<footer id="footer">
				<Chat allowChatNotifications={SettingsStore.chatNotifications} />
			</footer>
		</div>
	);
});

export default Home;