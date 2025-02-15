from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from models import ActorMovie, Actor, Movie
import schemas
import models

app = FastAPI()

# Montowanie plików statycznych dla interfejsu użytkownika
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    return models.Movie.create(**movie.dict())


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    movie = models.Movie.get_or_none(models.Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def delete_movie(movie_id: int):
    movie = models.Movie.get_or_none(models.Movie.id == movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    movie.delete_instance()
    return movie


@app.post("/actors", response_model=schemas.Actor)
def create_actor(actor: schemas.ActorCreate):
    return models.Actor.create(**actor.dict())


@app.get("/actors", response_model=List[schemas.Actor])
def get_actors():
    return list(models.Actor.select())


@app.post("/movies/{movie_id}/actors")
def add_actor_to_movie(movie_id: int, actor_link: schemas.MovieActorLink):
    movie = models.Movie.get_or_none(models.Movie.id == movie_id)
    actor = models.Actor.get_or_none(models.Actor.id == actor_link.actor_id)

    if not movie or not actor:
        raise HTTPException(status_code=404, detail="Movie or Actor not found")
    
    movie.actors.add(actor)
    return {"message": "Dodano aktora do filmu"}


@app.get("/movies/{movie_id}/actors", response_model=List[schemas.Actor])
def get_movie_actors(movie_id: int):
    movie = models.Movie.get_or_none(models.Movie.id == movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return list(movie.actors)


@app.delete("/movies/{movie_id}/actors/{actor_id}")
def remove_actor_from_movie(movie_id: int, actor_id: int):
    deleted_rows = ActorMovie.delete().where(
        (ActorMovie.movie_id == movie_id) & (ActorMovie.actor_id == actor_id)
    ).execute()
    
    if deleted_rows == 0:
        raise HTTPException(status_code=404, detail="Error: No such relation between actor and movie")


@app.delete("/actors/{actor_id}")
def delete_actor(actor_id: int):
    actor = models.Actor.get_or_none(models.Actor.id == actor_id)
    if not actor:
        raise HTTPException(status_code=404, detail="Error: Actor not found")
    
    ActorMovie.delete().where(ActorMovie.actor_id == actor_id).execute()
    actor.delete_instance()