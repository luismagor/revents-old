import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { getFirestore, reduxFirestore } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';
import firebase from '../config/firebase';

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  useFirestoreForProfile: true,
  updateProfileOnLogin: false,
};

export const configureStore = () => {
  const middlewares = [
    thunk.withExtraArgument({
      getFirebase,
      getFirestore,
    }),
  ];

  const composedEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares),
    reduxFirestore(firebase, rrfConfig)
  );

  const store = createStore(rootReducer, composedEnhancer);

  return store;
};
