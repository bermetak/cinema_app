import React, {Fragment, Component} from 'react'
import {MOVIES_URL} from "../../urls";
import MovieCard from "../../components/MovieCard/MovieCard";
import {NavLink} from "react-router-dom";
import axios from 'axios';


class MovieList extends Component {
    state = {
        movies: [],
    };

    componentDidMount() {
        axios.get(MOVIES_URL)
            .then(response => {console.log(response.data); return response.data;})
            .then(movies => this.setState({movies}))
            .catch(error => console.log(error));
    }

    render() {
        const aviableMovies = this.state.movies.filter(function (movie) {
            return movie.is_deleted === false;
        });
        return <Fragment>
            <p><NavLink to='/movies/add'>Добавить фильм</NavLink></p>
            <div className='row'>
                {aviableMovies.map(movie => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3'  key={movie.id}>
                        <MovieCard movie={movie}/>
                    </div>
                })}
            </div>
        </Fragment>
    }
}


export default MovieList;