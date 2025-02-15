import { useState } from "react";

function AssignActorForm({ actors, movies, onAssign }) {
    const [selectedActor, setSelectedActor] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedActor && selectedMovie) {
            onAssign(selectedMovie, selectedActor);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Assign Actor to Movie</h3>
            <select onChange={(e) => setSelectedMovie(e.target.value)} required>
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
            </select>
            <select onChange={(e) => setSelectedActor(e.target.value)} required>
                <option value="">Select an actor</option>
                {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>{actor.name} {actor.surname}</option>
                ))}
            </select>
            <button type="submit">Assign Actor</button>
        </form>
    );
}

export default AssignActorForm;