import React, {Fragment, Component} from 'react'
import {HALL_URL} from "../../urls";
import {NavLink} from "react-router-dom";
import axios from 'axios';
import Card from "../../components/UI/Card/Card";


class HallList extends Component {
    state = {
        halls: [],
    };


    componentDidMount() {
        axios.get(HALL_URL)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .then(halls => this.setState({halls}))
            .catch(error => console.log(error));
    }

    render() {
        const aviableHalls = this.state.halls.filter(function (hall) {
            return hall.is_deleted === false;
        });

        return <Fragment>
            {console.log(this.state.halls)}

            <p><NavLink to='/halls/add'>Добавить зал</NavLink></p>
            <div className='row'>
                {aviableHalls.map(hall => {
                    return <div className='col-xs-12 col-sm-6 col-lg-4 mt-3' key={hall.id}>

                        <Card header={hall.name} linkUrl={'/halls/' + hall.id} linkText={'About'} text={hall.description} className='h-100'/>


                    </div>
                })}
            </div>
        </Fragment>
    }
}


export default HallList;