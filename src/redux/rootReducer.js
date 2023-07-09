import { combineReducers } from 'redux';
import loginReducer from '../pages/Login/loginReducer';

const rootReducer = combineReducers({
  login: loginReducer
});

export default rootReducer;
