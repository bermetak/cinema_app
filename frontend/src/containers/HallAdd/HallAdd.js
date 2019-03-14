import React, {Component, Fragment} from 'react'
import axios from "axios";
import {HALL_URL} from "../../urls";


class HallAdd extends Component {
    state = {
        hall: {name: '', description: ''},
        alert: null,
        submitEnabled: true,
    };

    showErrorAlert = (error) => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `Hall was not added!`};
            return newState;
        });
    };


    updateHallState = (fieldName, value) => {
        this.setState(prevState => {
            let newState = {...prevState};
            let hall = {...prevState.hall};
            console.log(hall)
            hall[fieldName] = value;
            newState.hall = hall;
            return newState;
        });
    };

    gatherFormData = () => {
        let formData = new FormData();
        let hall = this.state.hall;
        Object.keys(hall).forEach(key => {
            const value = hall[key];
            if (value) {
                formData.append(key, value);
            }
        });
        return formData;
    };

    formSubmitted = () => {
        const formData = this.gatherFormData();
        console.log();
        return axios.post(HALL_URL, formData)
            .then(response => {
                const hall = response.data;
                console.log(hall);
                this.props.history.push('/halls/' + hall.id);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                this.showErrorAlert(error.response);
            });
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateHallState(fieldName, value);
    };


    render() {

        const alert = this.state.alert;
        const {name, description} = this.state.hall;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            <form onSubmit={this.formSubmitted}>
                <div className="form-group">
                    <label className="font-weight-bold">Название</label>
                    <input type="text" className="form-control" name="name" value={name}
                           onChange={this.inputChanged}/>
                </div>
                <div className="form-group">
                    <label>Описание</label>
                    <input type="text" className="form-control" name="description" value={description}
                           onChange={this.inputChanged}/>
                </div>

                <button disabled={!this.state.submitEnabled} type="submit"
                        className="btn btn-primary">Сохранить
                </button>
            </form>
        </Fragment>
    }
}


export default HallAdd