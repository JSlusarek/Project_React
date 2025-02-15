function ActorsList({ actors, onDeleteActor }) {
    return (
        <div>
            <h3>Actors List</h3>
            <ul>
                {actors.map((actor) => (
                    <li key={actor.id}>
                        {actor.name} {actor.surname} 
                        {' '}
                        <a 
                            onClick={() => onDeleteActor(actor.id)}
                        >
                            Delete
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActorsList;
