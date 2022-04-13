import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movie/moviesSlice';

export default configureStore({
  reducer: {
    movies: moviesReducer,
  },
});
