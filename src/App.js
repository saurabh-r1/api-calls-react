import React, { useState, useEffect, useCallback, useMemo } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(null);

  // Form input states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieOpeningText, setNewMovieOpeningText] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState("");

  const fetchMoviesHandler = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
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

  // Function to handle movie addition
 // Function to handle movie addition
const addMovieHandler = (event) => {
  event.preventDefault();
  const newMovie = {
    title: newMovieTitle,
    openingText: newMovieOpeningText,
    releaseDate: newMovieReleaseDate,
  };

  // Log the new movie object to the console
  console.log(newMovie);

  // Assuming you have a function to add the new movie to the list
  // You can replace this with your actual implementation
  setMovies((prevMovies) => [...prevMovies, newMovie]);

  // Clear the form inputs
  setNewMovieTitle("");
  setNewMovieOpeningText("");
  setNewMovieReleaseDate("");
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
      return <MoviesList movies={movies} />;
    }
    return <p>Found no movies.</p>;
  }, [isLoading, error, retrying, movies, cancelRetryHandler]);

  return (
    <React.Fragment>
      <section>
        <form onSubmit={addMovieHandler}>
          <label>Title:</label>
          <input
            type="text"
            value={newMovieTitle}
            onChange={(e) => setNewMovieTitle(e.target.value)}
            required
          />
          <label>Opening Text:</label>
          <textarea
            value={newMovieOpeningText}
            onChange={(e) => setNewMovieOpeningText(e.target.value)}
            required
          ></textarea>
          <label>Release Date:</label>
          <input
            type="text"
            value={newMovieReleaseDate}
            onChange={(e) => setNewMovieReleaseDate(e.target.value)}
            required
          />
          <button type="submit">Add Movie</button>
        </form>
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
