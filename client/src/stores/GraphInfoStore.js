import { observable } from 'mobx'
import { createContext } from 'react';

class GraphInfoStore {
     @observable prevMonthDate = '';
     @observable currentDate = '';
     @observable graphData = {};
}


export const GraphInfoStoreContext = createContext(new GraphInfoStore());
