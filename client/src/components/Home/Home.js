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
import { UtilityStoreContext } from '../../stores/UtilityStore'

// TODO:
// - Change all child components to functional
// - Move setStartDate and setEndDate into constructor of GraphInfoStore

const Home = observer(() => {
	const GraphInfoStore = useContext(GraphInfoStoreContext)
	const WatchlistStore = useContext(WatchlistStoreContext)
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

				<Chart />

			</div>
			<Chat />
		</div>
	);
});

export default Home;