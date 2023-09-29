import React from "react";

const MoviesList = (props) => {
  const deleteMovieHandler = async (movieId) => {
    try {
      // Make a DELETE request to remove the movie from the Firebase database
      const response = await fetch(
        `https://api-call-react-7d7f8-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the movie.");
      }

      // Call the parent component's deleteMovieHandler function to update the UI
      props.onDeleteMovie(movieId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ul>
      {props.movies.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.openingText}</p>
          <p>{movie.releaseDate}</p>
          <button onClick={() => deleteMovieHandler(movie.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default MoviesList;
