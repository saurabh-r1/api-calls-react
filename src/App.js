import React, { useState, useEffect,useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(null);

  const fetchMoviesHandler = useCallback (async() => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
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
      setIsLoading(false);
      setRetrying(false); // Reset retrying state when the API call is successful
      if (retryTimeout) {
        clearTimeout(retryTimeout); // Clear the retry timeout if it's still active
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      if (!retrying) {
        setRetrying(true);
        // Retry the API call after a 5-second delay
        setRetryTimeout(setTimeout(fetchMoviesHandler, 5000));
      }
    }
  },[]);

  useEffect(() => {
    fetchMoviesHandler(); 
  }, []);

  const cancelRetryHandler = () => {
    setRetrying(false);
    setError(null);
    setIsLoading(false);
    if (retryTimeout) {
      clearTimeout(retryTimeout); // Clear the retry timeout
    }
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying ? (
          <button onClick={cancelRetryHandler}>Cancel</button>
        ) : (
          <p>Retrying...</p>
        )}
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
