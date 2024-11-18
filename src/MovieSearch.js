import React, { useState, useEffect } from "react";

// Modal Component
const Modal = ({ movie, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "450px", // Make modal smaller
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#ff4d4d",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "4px",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          Close
        </button>
        <h2 style={{ fontSize: "1.5em", marginBottom: "10px" }}>{movie.name}</h2>
        <img
          src={movie.image ? movie.image.medium : "https://via.placeholder.com/210x295"}
          alt={movie.name}
          style={{
            width: "100%",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        />
        <p><strong>Language:</strong> {movie.language}</p>
        <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
        <p><strong>Release Year:</strong> {movie.premiered ? new Date(movie.premiered).getFullYear() : "N/A"}</p>
        <p><strong>Average Rating:</strong> {movie.rating.average || "N/A"}</p>
        <p><strong>Summary:</strong> <span dangerouslySetInnerHTML={{ __html: movie.summary || "N/A" }} /></p>
      </div>
    </div>
  );
};

const MovieSearch = () => {
  const [movieName, setMovieName] = useState(""); // User input for search
  const [movie, setMovie] = useState(null); // Fetched movie data
  const [popularMovies, setPopularMovies] = useState([]); // Popular movies list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedMovie, setSelectedMovie] = useState(null); // Movie selected for modal

  // Fetch popular movies by default when component mounts
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.tvmaze.com/shows`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPopularMovies(data); // Set popular movies
      } catch (err) {
        setError("Error fetching popular movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchPopularMovies();
  }, []);

  // Fetch movie details by search term
  const fetchMovie = async (query) => {
    if (!query) return; // Skip fetch if the input is empty
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovie(data); // Update movie state
    } catch (err) {
      setError("Movie not found. Please try another title.");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    fetchMovie(movieName);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true); // Show modal with movie details
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMovie(null); // Clear selected movie
  };

  // Extract the year from the premiere date
  const getReleaseYear = (premiered) => {
    return premiered ? new Date(premiered).getFullYear() : "N/A";
  };

  // Filter out the searched movie from the popular movies list (if any)
  const displayMovies = movie ? popularMovies.filter((popularMovie) => popularMovie.id !== movie.id) : popularMovies;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "linear-gradient(to right, #8e8e8e, #3498db)", padding: '2%', minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Movie Search</h1>

      {/* Centered Search Form */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "600px" }}>
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Enter movie name"
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginRight: "10px",
              width: "100%", // Take full width on mobile
              maxWidth: "300px", // Limit max width on larger screens
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "4px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading or error message */}
      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Display Searched Movie (if any) */}
      {movie && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#fff" }}>Searched Movie</h2>
          <div
            onClick={() => handleMovieClick(movie)} // Open modal on click
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              maxWidth: "200px",
              textAlign: "center",
              cursor: "pointer", // Indicate clickable item
            }}
          >
            <img
              src={movie.image ? movie.image.medium : "https://via.placeholder.com/210x295"}
              alt={movie.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                maxWidth: "200px", // Resize image for small screen
                height: "auto",
              }}
            />
            <h3>{movie.name}</h3>
            <p><strong>Release Year:</strong> {getReleaseYear(movie.premiered)}</p>
            <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
          </div>
        </div>
      )}

      {/* Display Popular Movies by Default (excluding searched movie) */}
      <h2 style={{ color: "#fff" }}>Popular Movies</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {displayMovies.slice(0, 5).map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie)} // Open modal on click
            style={{
              width: "200px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={movie.image ? movie.image.medium : "https://via.placeholder.com/210x295"}
              alt={movie.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                maxWidth: "200px", // Resize image for small screens
                height: "auto",
              }}
            />
            <h3>{movie.name}</h3>
            <p><strong>Release Year:</strong> {getReleaseYear(movie.premiered)}</p>
            <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Modal for movie details */}
      {modalVisible && selectedMovie && (
        <Modal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MovieSearch;
