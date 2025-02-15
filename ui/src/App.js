import './App.css';
import {useState, useEffect} from "react";
import 'milligram';
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorsList from "./ActorsList";
import AddActorForm from "./AddActorForm";
import AssignActorForm from "./AssignActorForm";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [assigningActor, setAssigningActor] = useState(false);
    const [addingActor, setAddingActor] = useState(false);

    // moved fetchMovies to a separate function
    const fetchMovies = async () => {
        const response = await fetch(`/movies`);
        if (response.ok) {
            const movies = await response.json();
            setMovies(movies);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchActors = async () => {
            const response = await fetch(`/actors`);
            if (response.ok) {
                const actors = await response.json();
                setActors(actors);
            }
        };
        fetchActors();
      }, []);

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const newMovie = await response.json();
          setMovies([...movies, newMovie]);
          setAddingMovie(false);
        }
      }
    
    async function handleDeleteMovie(movie) {
        if (!window.confirm(`You want to delete the movie "${movie.title}"?`)) {
            return;
        }
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies);
        }
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const newActor = await response.json();
            setActors([...actors, newActor]);
        }
    }

    async function handleAssignActorToMovie(movieId, actorId) {
        const response = await fetch(`/movies/${movieId}/actors`, {
            method: 'POST',
            body: JSON.stringify({ actor_id: actorId }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            alert("Actor added to movie!");
            setAssigningActor(false);
            fetchMovies();
        }
    }

    async function handleRemoveActorFromMovie(movieId, actorId) {
        if (!window.confirm(`You want to remove movie?`)) {
            return;
        }
        const response = await fetch(`/movies/${movieId}/actors/${actorId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert("Actor was removed from movie!");
            fetchMovies();
        } else {
            alert("It is impossible to remove actor from movie.");
        }
    }

    async function handleDeleteActor(actorId) {
        if (!window.confirm(`You wanna delete this actor?`)) {
            return;
        }
        const response = await fetch(`/actors/${actorId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert("Actor deleted successfully!");
            setActors(actors.filter(actor => actor.id !== actorId));
        } else {
            alert("Error: Could not delete actor.");
        }
    }

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={(movie) => handleDeleteMovie(movie)}
                              onAssignActor={() => setAssigningActor(true)}
                              onRemoveActor={handleRemoveActorFromMovie}
                              actors={actors}
                />}
            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
            <h2>Actors</h2>
            <ActorsList actors={actors} onDeleteActor={handleDeleteActor}/>
            {addingActor
                ? <AddActorForm onActorSubmit={handleAddActor} />
                : <button onClick={() => setAddingActor(true)}>Add an Actor</button>}
            <h2>Actors in movies</h2>
            {assigningActor && <AssignActorForm actors={actors} movies={movies} onAssign={handleAssignActorToMovie} />}
            <button onClick={() => setAssigningActor(true)}>Assign an Actor to a Movie</button>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}

export default App;
