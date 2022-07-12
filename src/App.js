import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // GET request
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error(`Something went wrong. ${response.status}`);
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);

    /* commented out below code in favor of using async/await
    fetch("https://swapi.dev/api/films/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const transformedMovies = data.results.map((movieData) => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
          };
        });

        setMovies(transformedMovies);
      });
    */
  };

  let content = <p>Found no movies.</p>;

  if (!isLoading && movies.length > 0) {
    content = <MoviesList movies={movies} />;
  } else if (!isLoading && error) {
    content = <p>{error}</p>;
  } else if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={handleFetchMovies}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
