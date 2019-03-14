import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router';
import './App.css';
import MovieList from "./containers/MovieList/MovieList";
import MovieDetail from "./containers/MovieDetail/MovieDetail";
import MovieAdd from "./containers/MovieAdd/MovieAdd";
import MovieEdit from "./containers/MovieEdit/MovieEdit";
import HallList from "./containers/HallList/HallList";
import HallDetail from "./containers/HallDetail/HallDetail";

class App extends Component {
    render() {
        return (
            <div className="container">
                <BrowserRouter>
                    <Switch>
                        <Route path="/halls/:id" component={HallDetail}/>
                        <Route path="/halls/" component={HallList}/>

                        <Route path="/movies/add" component={MovieAdd}/>
                        <Route path="/movies/:id/edit" component={MovieEdit}/>
                        <Route path="/movies/:id" component={MovieDetail}/>
                        <Route path="" component={MovieList}/>

                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
