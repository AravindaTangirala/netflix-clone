//This component creates rows and sections for the api to fill with shows/movies

import React, { useState, useEffect } from "react";
import axios from "../axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  //whenever we click on a thumbnail we want to capture the trailer url, so we need a state below
  const [trailerUrl, setTrailerUrl] = useState("");
  //runs based on a specific condition/variable change
  //run this hook when the row component loads and make areq to TMDB to fetch/get movies info
  // each time the row is loaded this is called to fill the rows with movies from the fetchUrl.
  useEffect(() => {
    // in order to use async inside of useEffect you need to make it a function.
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      //fetchUrl = https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
      //will replace API_KEY
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  console.log(movies);
  //options for react-youtube to autoplay
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoPlay: 1,
    },
  };
  const handleClick = (movie) => {
    // set trailer url to stop playing other video if one is playing
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      console.log(movie.name);
      movieTrailer(movie?.title || movie?.name || movie?.source)
        .then((url) => {
          // we only want the ID from url, everything after ? v=kjj
          const urlParams = new URLSearchParams(new URL(url).search);
          console.log(urlParams);
          setTrailerUrl(urlParams.get("v"));
          console.log("the url for the trailer is " + trailerUrl);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>
      {/* everything gets row_posters class except isLargeRow which gets row_postersLarge class */}
      <div className="row__posters">
        {/* several row posters */}
        {movies.map((movie) => (
          <img
            // "key" will optimize the rendering of the images. This is critical in production systems with lots of images. should be general practice.  In this case it will keep react from rending the same movie poster image more than once
            key={movie.id}
            //to play trailer we click on picture of the movie and unique movie is captured based on map function
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            /* {container with posters} */
          />
        ))}
      </div>
      <div className="row_video_player">
        {/* https://www.youtube.com/watch?v=H9Ht27r7ROk */}
        {/* react-youtube takes videoID and opts as attributes */}
        {console.log(typeof trailerUrl)}
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
