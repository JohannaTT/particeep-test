import {createSlice, current} from '@reduxjs/toolkit'
import {movies$} from "../../api/movies";

// Slice

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    moviesList: [],
    moviesByCategory: []
  },
  reducers: {
    // duplicate lines of code because we working on a static API
    setAll: (state, action) => {
      state.moviesList = action.payload;
      state.moviesByCategory = action.payload;
    },
    getAllByCategory: (state, action) => {
      const selectedCategories = action.payload; // ["Drame", "Animation",...]
      if (selectedCategories.length !== 0) {
        state.moviesByCategory = current(state.moviesList).filter((movie) => action.payload.includes(movie.category));
      } else {
        state.moviesByCategory = state.moviesList;
      }
    },
    deleteMovieById: (state, action) => {
      state.moviesList = current(state.moviesList).filter((movie) => movie.id !== action.payload);
      state.moviesByCategory = current(state.moviesByCategory).filter((movie) => movie.id !== action.payload);
    },
    incrementLike: (state, action) => {
      const keyMovieArray = current(state.moviesList).findIndex((movie) => movie.id === action.payload);
      state.moviesList[keyMovieArray].likes += 1;
      
      const keyMovieArrayByCategory = current(state.moviesByCategory).findIndex((movie) => movie.id === action.payload);
      state.moviesByCategory[keyMovieArrayByCategory].likes += 1;
    },
    decrementLike: (state, action) => {
      const keyMovieArray = current(state.moviesList).findIndex((movie) => movie.id === action.payload);
      state.moviesList[keyMovieArray].likes -= 1;
      
      const keyMovieArrayByCategory = current(state.moviesByCategory).findIndex((movie) => movie.id === action.payload);
      state.moviesByCategory[keyMovieArrayByCategory].likes -= 1;
    },
    incrementDislike: (state, action) => {
      const keyMovieArray = current(state.moviesList).findIndex((movie) => movie.id === action.payload);
      state.moviesList[keyMovieArray].dislikes += 1;
      
      const keyMovieArrayByCategory = current(state.moviesByCategory).findIndex((movie) => movie.id === action.payload);
      state.moviesByCategory[keyMovieArrayByCategory].dislikes += 1;
    },
    decrementDislike: (state, action) => {
      const keyMovieArray = current(state.moviesList).findIndex((movie) => movie.id === action.payload);
      state.moviesList[keyMovieArray].dislikes -= 1;
      
      const keyMovieArrayByCategory = current(state.moviesByCategory).findIndex((movie) => movie.id === action.payload);
      state.moviesByCategory[keyMovieArrayByCategory].dislikes -= 1;
    }
  }
});

// Actions

const { setAll } = moviesSlice.actions
export const { getAllByCategory, deleteMovieById, incrementLike, decrementLike, incrementDislike, decrementDislike } = moviesSlice.actions

export const getAllMovies = () => async dispatch => {
  try {
    await movies$
      .then((data) => dispatch(setAll(data)))
  } catch(e) {
    return console.error(e.message);
  }
}

export default moviesSlice.reducer
