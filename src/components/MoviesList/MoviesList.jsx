import React, {useCallback, useEffect, useMemo, useState} from "react";
import Movie from "./Movie/Movie";
import {
  Container,
  Grid,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  ListItemText,
  TablePagination
} from "@mui/material";

import {useDispatch, useSelector} from "react-redux";
import {getAllMovies, getAllByCategory} from "../../features/movie/moviesSlice";

import './MoviesList.css';

const MoviesList = () => {
  const movies = useSelector(state => state.movies.moviesList);
  const moviesByCategory = useSelector(state => state.movies.moviesByCategory);
  const dispatch = useDispatch();
  const [categoryMovie, setCategoryMovie] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [showMoviesWithPagination, setShowMoviesWithPagination] = useState([]);
  
  useEffect(() => {
    dispatch(getAllMovies());
  }, [dispatch]);
  
  useEffect(() => {
    const startElement = rowsPerPage * page;
    const endElement = startElement + rowsPerPage;
    setShowMoviesWithPagination(moviesByCategory.slice(startElement, endElement));
  }, [moviesByCategory, page, rowsPerPage]);
  
  const handleCategoryChange = useCallback((event) => {
    setPage(0);
    const {target: { value }} = event;
    dispatch(getAllByCategory(value));
    setCategoryMovie(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }, [dispatch]);
  
  const removeDuplicateCategories = useCallback((movies) => {
    return movies.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.category === value.category
      ))
    )
  }, []);
  
  // Pagination
  const defaultLabelDisplayedRows = ({ from, to, count }) => { return `${from}–${to} sur ${count !== -1 ? count : `more than ${to}`}`; }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  return(
    <Container>
      <div className="HeaderTitleList">
        <h1>Liste des films :</h1>
        <FormControl sx={{ m: 1, width: 300 }}>
          <Select
            multiple
            displayEmpty
            value={categoryMovie}
            onChange={handleCategoryChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <p>Catégories</p>;
              }
              return selected.join(', ')
            }}
          >
            {removeDuplicateCategories(movies).map((movie) => (
              <MenuItem
                key={movie.id}
                value={movie.category}
              >
                <Checkbox checked={categoryMovie.indexOf(movie.category) > -1} />
                <ListItemText primary={movie.category} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Grid container spacing={2}>
        {showMoviesWithPagination.map((movie) => {
          return (
            <Grid item xs={12} sm={6} key={movie.id}>
              <Movie movie={movie} />
            </Grid>
          )
        })}
        <Grid className="ContainerPagination" item xs={12}>
          <TablePagination
            component="div"
            count={moviesByCategory.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={defaultLabelDisplayedRows}
            labelRowsPerPage="Éléments par page"
            rowsPerPageOptions={[4, 8, 12]}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default MoviesList;