import React, {Component} from 'react'
import {HALL_URL} from "../../urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';


class HallDetail extends Component {
    state = {
        hall: null
    };

    componentDidMount() {
        const match = this.props.match;

        axios.get(HALL_URL + match.params.id)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(hall => this.setState({hall}))
            .catch(error => console.log(error));
    }

    deleteHall = (event) => {

        event.preventDefault();
        const newState = {...this.state};

            newState.hall.is_deleted = true;
            this.setState(newState);

        return axios.put(HALL_URL + this.state.hall.id + '/', this.state.hall)
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


    render() {
        if (!this.state.hall) return null;

        const {name, description, id} = this.state.hall;

        return <div>

            <h1>{name}</h1>

            {description ? <p className="text-secondary">{description}</p> : null}

            <NavLink to={'/halls/' + id + '/edit'} className="btn btn-primary mr-2">Edit</NavLink>

            <NavLink to='/halls/' className="btn btn-primary mr-2">Halls</NavLink>
            <button onClick={this.deleteHall} className="btn btn-primary">Delete hall</button>
        </div>;
    }
}


export default HallDetail;