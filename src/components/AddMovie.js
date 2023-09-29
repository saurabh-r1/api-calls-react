import React, { useState } from "react";

const AddMovie = (props) => {
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieOpeningText, setNewMovieOpeningText] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState("");

  const addMovieHandler = async (event) => {
    event.preventDefault();
    const newMovie = {
      title: newMovieTitle,
      openingText: newMovieOpeningText,
      releaseDate: newMovieReleaseDate,
    };

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

      // Call the parent component's addMovieHandler function
      props.onAddMovie(newMovie);

      // Clear the form inputs
      setNewMovieTitle("");
      setNewMovieOpeningText("");
      setNewMovieReleaseDate("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
};

export default AddMovie;
