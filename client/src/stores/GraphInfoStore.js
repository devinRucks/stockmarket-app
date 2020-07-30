// import { observable, computed } from 'mobx';
import { observable } from 'mobx-react-lite'

class GraphInfoStore {
     @observable prevMonthDate = '';
     @observable currentDate = '';
     @observable graphData = {};
}


export const GraphInfoStoreContext = createContext(new GraphInfoStore());

// export const LanguagesStoreContext = createContext(new LanguagesStore());