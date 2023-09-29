import React, { useState, useEffect, useCallback, useMemo } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://api-call-react-7d7f8-default-rtdb.firebaseio.com/movies.json");

      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }

      const data = await response.json();

      const transformedMovies = Object.keys(data).map((movieId) => ({
        id: movieId,
        title: data[movieId].title,
        openingText: data[movieId].openingText,
        releaseDate: data[movieId].releaseDate,
      }));

      setMovies(transformedMovies);
      setIsLoading(false);
      setRetrying(false);
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      if (!retrying) {
        setRetrying(true);
        setRetryTimeout(setTimeout(fetchMoviesHandler, 5000));
      }
    }
  }, [retrying, retryTimeout]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const cancelRetryHandler = useCallback(() => {
    setRetrying(false);
    setError(null);
    setIsLoading(false);
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  }, [retryTimeout]);

  const addMovieHandler = async (newMovie) => {
    // Make a POST request to add the new movie to the Firebase database
    try {
      const response = await fetch("https://api-call-react-7d7f8-default-rtdb.firebaseio.com/movies.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to add the movie.");
      }

      // Update the UI by adding the new movie to the list
      setMovies((prevMovies) => [...prevMovies, newMovie]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovieHandler = async (movieId) => {
    // Make a DELETE request to remove the movie from the Firebase database
    try {
      const response = await fetch(
        `https://api-call-react-7d7f8-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the movie.");
      }

      // Update the UI by removing the movie from the list
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error(error);
    }
  };

  const content = useMemo(() => {
    if (isLoading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return (
        <div>
          <p>{error}</p>
          {retrying ? <button onClick={cancelRetryHandler}>Cancel</button> : <p>Retrying...</p>}
        </div>
      );
    }
    if (movies.length > 0) {
      return <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
    }
    return <p>Found no movies.</p>;
  }, [isLoading, error, retrying, movies, cancelRetryHandler, deleteMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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
