import { observable, action } from 'mobx'
import { createContext } from 'react'

class UtilityStore {
     @observable loading = false;
     @observable errorMsg = false;

     @action
     setLoading = (loading) => {
          (loading) ? this.loading = true : this.loading = false;
     }

     @action
     setErrorMsg = (errMsg) => {
          (errMsg) ? this.errorMsg = true : this.errorMsg = false;
     }
}

export const UtilityStoreContext = createContext(new UtilityStore());