import { combineReducers } from 'redux';

import rooftop from './domain/rooftop';
import map from './ui/map';

export default combineReducers({
  map,
  rooftop,
});
