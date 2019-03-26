import React, {Component} from 'react'
import {MOVIES_URL, SHOWS_URL} from "../../urls";
import {NavLink} from "react-router-dom";
import MovieCategories from "../../components/MovieCategories/MovieCategories";
import axios from 'axios';
import moment from "moment";
import ShowSchedule from "../../components/ShowSchedule/ShowSchedule";


class MovieDetail extends Component {
    state = {
        movie: null,
        shows: null,
    };

    componentDidMount() {
        const match = this.props.match;
        axios.get(MOVIES_URL + match.params.id)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(movie => {
                this.setState({movie});
                this.loadShows(movie.id)})
            .catch(error => console.log(error));
    }

    deleteMovie = (event) => {
        event.preventDefault()
        return axios.delete(MOVIES_URL + this.state.movie.id, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const movie = response.data;
                console.log(movie);
                this.props.history.push('');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });

    };


    loadShows = (movieId) => {
        const startsAfter = moment().format('YYYY-MM-DD HH:mm');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');
        {console.log(movieId, startsAfter, startsBefore)}

        const query = encodeURI(`movie_id=${movieId}&starts_after=${startsAfter}&starts_before=${startsBefore}`);
        axios.get(`${SHOWS_URL}?${query}`).then(response => {
            console.log(response);
            this.setState(prevState => {
                let newState = {...prevState};
                newState.shows = response.data;
                return newState;
            })
        }).catch(error => {
            console.log(error);
            console.log(error.response);
        });
    };


    render() {
        if (!this.state.movie) return null;

        const {name, poster, description, release_date, finish_date, categories, id} = this.state.movie;

        return <div>
            {poster ? <div className='text-center'>
                <img className="img-fluid rounded" src={poster} alt='Постер'/>
            </div> : null}

            <h1>{name}</h1>


            {categories.length > 0 ? <MovieCategories categories={categories}/> : null}

            <p className="text-secondary">В прокате c: {release_date} до: {finish_date ? finish_date : "Неизвестно"}</p>
            {description ? <p>{description}</p> : null}

            <NavLink to={'/movies/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

            <NavLink to='' className="btn btn-primary mr-2">Movies</NavLink>
            <button onClick={this.deleteMovie} className="btn btn-primary">Delete movie</button>
            {console.log(this.state.shows)}
            {this.state.shows ? <ShowSchedule shows={this.state.shows} /> : null}
        </div>;
    }
}


export default MovieDetail;