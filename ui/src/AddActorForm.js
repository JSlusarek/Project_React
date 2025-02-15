import { useState } from "react";
import './App.css';

function AddActorForm({ onActorSubmit }) {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && surname) {
            onActorSubmit({ name, surname });
            setName("");
            setSurname("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add a new Actor</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
            <button type="submit">Add Actor</button>
        </form>
    );
}

export default AddActorForm;