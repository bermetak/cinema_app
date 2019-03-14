import React from 'react';
import Card from "../UI/Card/Card";


const MovieCard = props => {
    const {movie} = props;
    const {name, poster, id} = movie;
    // const link = {
    //     text: 'Read more',
    //     url:
    // };

    return <Card header={name} image={poster} linkText={'Read more'} linkUrl={'/movies/' + id} className='h-100'/>;
};


export default MovieCard;