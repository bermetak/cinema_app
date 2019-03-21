import React, {Component, Fragment} from 'react'
import axios from "axios";
import {MOVIES_URL} from "../../urls";
import MovieForm from "../../components/MovieForm/MovieForm";


class MovieEdit extends Component {
    state = {
        movie: null,

        alert: null,
        errors: {}
    };

    componentDidMount() {

        axios.get(MOVIES_URL + this.props.match.params.id)
            .then(response => {
                const movie = response.data;
                console.log(movie);
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.movie = movie;
                    newState.movie.categories = movie.categories.map(category => category.id);
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }

    showErrorAlert = (error) => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `Movie was not added!`};
            return newState;
        });
    };

    gatherFormData = (movie) => {
        let formData = new FormData();
        Object.keys(movie).forEach(key => {
            const value = movie[key];
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        formData.append(key, item)
                        console.log(key, item)
                    });
                    console.log(key, value);
                } else {
                    formData.append(key, value);
                }
            }
        });
        return formData;
    };

    formSubmitted = (movie) => {
        const formData = this.gatherFormData(movie);
        console.log(movie);
        return axios.put(MOVIES_URL + this.props.match.params.id + '/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const movie = response.data;
                console.log(movie);
                this.props.history.replace('/movies/' + movie.id);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                this.showErrorAlert(error.response);
                this.setState({
                    ...this.state,
                    errors: error.response.data
                })
            });
    };

    render() {
        const {alert, movie, errors} = this.state;
        return <Fragment>
            {console.log(this.state.movie)}
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            {movie ? <MovieForm onSubmit={this.formSubmitted} movie={movie} errors={errors}/> : null}

        </Fragment>
    }
}


export default MovieEdit