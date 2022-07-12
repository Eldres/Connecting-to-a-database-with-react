import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const starWarsAPI = "https://swapi.dev/api/films/";
  const firebaseBaseAPI =
    "https://react-http-request-2384c-default-rtdb.firebaseio.com";
  const firebaseMoviesAPI = `${firebaseBaseAPI}/movies.json`;

  const handleFetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // GET request
      const response = await fetch(firebaseMoviesAPI);

      if (!response.ok) {
        throw new Error(`Something went wrong. ${response.status}`);
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // const transformedMovies = data.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });

      setMovies(loadedMovies);
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
  }, [firebaseMoviesAPI]);

  const handleAddMovie = async (movie) => {
    // Sending POST request
    const response = await fetch(firebaseMoviesAPI, {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    handleFetchMovies();
  }, [handleFetchMovies]);

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
        <AddMovie onAddMovie={handleAddMovie} />
      </section>
      <section>
        <button onClick={handleFetchMovies}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
