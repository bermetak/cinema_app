import React, {Component} from 'react'
import {HALL_URL, MOVIES_URL, SHOWS_URL} from "../../urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';
import moment from "moment";
import ShowSchedule from "../../components/ShowSchedule/ShowSchedule";


class HallDetail extends Component {
    state = {
        hall: null,
        shows: null,
    };

    componentDidMount() {
        const match = this.props.match;

        axios.get(HALL_URL + match.params.id)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(hall => {
                this.setState({hall});
                this.loadShows(hall.id)})
            .catch(error => console.log(error));
    }

    deleteHall = (event) => {
        event.preventDefault()
        return axios.delete(HALL_URL + this.state.hall.id, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + localStorage.getItem('auth-token')
            }
        })
            .then(response => {
                const hall = response.data;
                console.log(hall);
                this.props.history.push('/halls/');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });

    };

    loadShows = (hallId) => {
        const startsAfter = moment().format('YYYY-MM-DD HH:mm');
        const startsBefore = moment().add(3, 'days').format('YYYY-MM-DD');
        {console.log(hallId, startsAfter, startsBefore)}

        const query = encodeURI(`hall_id=${hallId}&starts_after=${startsAfter}&starts_before=${startsBefore}`);
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
        if (!this.state.hall) return null;

        const {name, description, id} = this.state.hall;

        return <div>

            <h1>{name}</h1>

            {description ? <p className="text-secondary">{description}</p> : null}

            <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

            <NavLink to='/halls/' className="btn btn-primary mr-2">Halls</NavLink>
            <button onClick={this.deleteHall} className="btn btn-primary">Delete hall</button>
            {console.log(this.state.shows)}
            {this.state.shows ? <ShowSchedule shows={this.state.shows} c_type={'hall'} /> : null}
        </div>;
    }
}


export default HallDetail;