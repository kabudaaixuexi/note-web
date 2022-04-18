// import { App } from "vue"; 
import State from "./state";
// import moon from "xins.store.df";
import createStore from 'sw-decorator-property'
export default createStore(State, {
    usePersisted: true
})
