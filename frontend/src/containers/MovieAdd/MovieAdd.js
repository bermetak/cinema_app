import React, {Component, Fragment} from 'react';
import {MOVIES_URL} from "../../urls";
import axios from 'axios';
import MovieForm from "../../components/MovieForm/MovieForm";


class MovieAdd extends Component {
    state = {
        alert: null,
        errors: {}
    };

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
                    value.forEach(item => formData.append(key, item));
                } else {
                    formData.append(key, value);
                }
            }
        });
        return formData;
    };

    formSubmitted = (movie) => {
        const formData = this.gatherFormData(movie);

        return axios.post(MOVIES_URL, formData, {
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
        const {alert, errors} = this.state;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            <MovieForm onSubmit={this.formSubmitted} errors={errors}/>
        </Fragment>
    }
}


export default MovieAdd;