import React, {Component, Fragment} from 'react'
import {USER_URL} from "../../urls";
import axios from 'axios/index';
import ProfileForm from "../../components/ProfileForm/ProfileForm";


class Profile extends Component {
    state = {
        user: {},
        edit: false,
        alert: null
    };

    componentDidMount() {
        axios.get(USER_URL + this.props.match.params.id).then(response => {
            console.log(response);
            this.setState(prevState => {
                return {...prevState, user: response.data};
            });
        }).catch(error => {
            console.log(error);
            console.log(error.response);
        })
    }

    onUserUpdate = (user) => {
        this.setState(prevState => {
            return {
                ...prevState,
                user,
                edit: false,
                alert: {type: 'success', text: 'Данные пользователя успешно обновлены!'}
            };
        });
    };

    toggleEdit = () => {
        this.setState(prevState => {
            return {
                ...prevState,
                edit: !prevState.edit,
                alert: null
            };
        });
    };

    render() {
        const currentUserId = parseInt(localStorage.getItem('id'));
        const {username, first_name, last_name, email} = this.state.user;
        const alert = this.state.alert;
        return <Fragment>
            {alert ? <div className={"alert mt-3 py-2 alert-" + alert.type} role="alert">{alert.text}</div> : null}
            <h1 className="mt-3">Личный кабинет</h1>
            {username ? <p>Имя пользователя: {username}</p> : null}
            {first_name ? <p>Имя: {first_name}</p> : null}
            {last_name ? <p>Фамиилия: {last_name}</p> : null}
            {email ? <p>Email: {email}</p> : null}

            {currentUserId === this.state.user.id ? <Fragment>
                <div className="my-4">
                    <button className="btn btn-primary" type="button" onClick={this.toggleEdit}>Редактировать</button>
                    <div className={this.state.edit ? "mt-4" : "mt-4 collapse"}>
                        <h2>Редактировать</h2>
                        <ProfileForm user={this.state.user} onUpdateSuccess={this.onUserUpdate}/>
                    </div>
                </div>
            </Fragment> : null}
        </Fragment>;
    }
}


export default Profile;