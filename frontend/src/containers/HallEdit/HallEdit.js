import React, {Component, Fragment} from 'react'
import axios from "axios";
import {HALL_URL} from "../../urls";


class HallEdit extends Component {
    state = {
        hall: null,

        alert: null,
        submitEnabled: true,
        errors: {}
    };

    componentDidMount() {

        axios.get(HALL_URL + this.props.match.params.id)
            .then(response => {
                const hall = response.data;
                console.log(hall);
                this.setState(prevState => {
                    const newState = {...prevState};
                    newState.hall = hall;
                    return newState;
                });
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
            });
    }


    showErrors = (name) => {
        if (this.state.errors && this.state.errors[name]) {
            return this.state.errors[name].map((error, index) => <p className="text-danger" key={index}>{error}</p>);
        }
        return null;
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

    showErrorAlert = (error) => {
        this.setState(prevState => {
            let newState = {...prevState};
            newState.alert = {type: 'danger', message: `Hall was not edited!`};
            return newState;
        });
    };

    gatherFormData = () => {
        let formData = new FormData();
        let hall = this.state.hall
        Object.keys(hall).forEach(key => {
            const value = hall[key];
            if (value) {
                formData.append(key, value);
            }
        });
        return formData;
    };

    formSubmitted = (event) => {
        event.preventDefault();
        const formData = this.gatherFormData();
        console.log();
        return axios.put(HALL_URL + this.props.match.params.id + '/', formData, {
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
                this.showErrorAlert(error.response);
                this.setState({
                    ...this.state,
                    errors: error.response.data
                })
            });
    };

    inputChanged = (event) => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.updateHallState(fieldName, value);
    };


    render() {
        if (!this.state.hall) return null;
        const alert = this.state.alert;
        const {name, description} = this.state.hall;
        return <Fragment>
            {alert ? <div className={"mb-2 alert alert-" + alert.type}>{alert.message}</div> : null}
            <form onSubmit={this.formSubmitted}>
                <div className="form-group">
                    <label className="font-weight-bold">Название</label>
                    <input type="text" className="form-control" name="name" value={name}
                           onChange={this.inputChanged}/>
                           {this.showErrors('name')}
                </div>
                <div className="form-group">
                    <label>Описание</label>
                    <input type="text" className="form-control" name="description" value={description}
                           onChange={this.inputChanged}/>
                           {this.showErrors('description')}
                </div>

                <button disabled={!this.state.submitEnabled} type="submit"
                        className="btn btn-primary">Сохранить
                </button>
            </form>
        </Fragment>
    }
}


export default HallEdit