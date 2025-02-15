export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                directed by {props.movie.director}
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
            {props.movie.description}

            {/* Wyświetlanie przypisanych aktorów */}
            {Array.isArray(props.movie.actors) && props.movie.actors.length > 0 ? (
                <ul>
                {props.movie.actors.map(actor => (
                    <li key={actor.id}>
                        {actor.name} {actor.surname} 
                        <a onClick = {() => props.onRemoveActor(props.movie.id, actor.id)}>  Remove</a>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No actors assigned</p>
            )}
        </div>
    );
}
