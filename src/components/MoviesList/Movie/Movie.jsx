import React, {useCallback, useMemo, useState} from "react";
import {Card, CardContent, Typography, LinearProgress} from '@mui/material';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import {
  deleteMovieById,
  incrementLike,
  decrementLike,
  incrementDislike,
  decrementDislike
} from "../../../features/movie/moviesSlice";
import './Movie.css';
import {useDispatch} from "react-redux";

const Movie = ({movie}) => {
  const dispatch = useDispatch();
  const [hasAddLike, setHasAddLike] = useState(false);
  const [hasAddDislike, setHasAddDislike] = useState(false);
  
  const likesPercentage = useMemo(() => {
    return movie.likes / (movie.likes + movie.dislikes) * 100;
  }, [movie.dislikes, movie.likes]);
  
  const deleteMovieOnClick = useCallback(() => {
    dispatch(deleteMovieById(movie.id))
  }, [dispatch, movie.id]);
  
  const addLikeOnMovie = useCallback(() => {
    if (!hasAddLike) {
      dispatch(incrementLike(movie.id));
      if (hasAddDislike) {
        dispatch(decrementDislike(movie.id));
      }
    } else {
      dispatch(decrementLike(movie.id));
    }
  
    setHasAddLike(!hasAddLike);
    setHasAddDislike(false);
  }, [dispatch, hasAddDislike, hasAddLike, movie.id]);
  
  const addDislikeOnMovie = useCallback(() => {
    if (!hasAddDislike) {
      dispatch(incrementDislike(movie.id));
      if (hasAddLike) {
        dispatch(decrementLike(movie.id));
      }
    } else {
      dispatch(decrementDislike(movie.id));
    }
  
    setHasAddDislike(!hasAddDislike);
    setHasAddLike(false);
  }, [dispatch, hasAddDislike, hasAddLike, movie.id]);
  
  return(
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <div className="HeaderCard">
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {movie.category}
          </Typography>
          <DeleteOutlineSharpIcon className="TrashIcon" onClick={deleteMovieOnClick} />
        </div>
        
        <h2 className="TitleMovie">
          {movie.title}
        </h2>
        
        <LinearProgress variant="determinate" value={likesPercentage} className="Progress" />
        
        <div className="ReviewsNumber">
          <div className="ThumbsUp">
            <ThumbUpIcon onClick={addLikeOnMovie} color={hasAddLike ? "success" : "inherit"} />
            <p>{movie.likes}</p>
          </div>
          <div className="ThumbsDown">
            {/*"success" for up and "error" for down, black for nothing*/}
            <ThumbDownIcon onClick={addDislikeOnMovie} color={hasAddDislike ? "error" : "inherit"} />
            <p>{movie.dislikes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Movie;