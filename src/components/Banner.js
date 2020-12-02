import React, { useState, useEffect } from "react";
import "./Banner.css";
import axios from "../axios";
import requests from "../requests";

function Banner() {
  const [movie, setMovie] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      //    the request result will give you the list of movies in an array, but here we want to randomly select a movie from array of movies
      // it gets a random nunber starting from 0 to the length-1(math.floor)
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);
  //to minimize the description string
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    // this header allows for styling of the background image that will not clash with "div" sections
    <header
      className="banner"
      style={{
        // tell the browser to have image cover space
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        {/* title */}
        <h1 className="banner__title">
          {/* this will pull the title or (||) name or (||) orignal_name from the movie state/effect above. there are three options because of the nature of the API using different naming convention.
          if .stuff does not return anything then the Optional Chaining feature (?) will tell keep it from crashing by giving null.
          The nameing convention of .stuff is from the API json return  */}
          {/* optional chaining title or name or original name  */}
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        {/* div-2 button */}
        {/* description */}
        <h3 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h3>
      </div>
      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
