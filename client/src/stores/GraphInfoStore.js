import { observable } from 'mobx'
// import { createContext } from 'react';

class GraphInfoStore {
     @observable prevMonthDate = '';
     @observable currentDate = '';
     @observable graphData = {};
}

const store = new GraphInfoStore();
export default store;
// export const GraphInfoStoreContext = createContext(new GraphInfoStore());
