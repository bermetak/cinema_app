import React from 'react';
import Card from "../UI/Card/Card";


const MovieCard = props => {
    const {movie} = props;
    const {name, poster, id} = movie;


    return <Card header={name} image={poster} link={'/movies/' + id} className='h-100'/>;
};


export default MovieCard;