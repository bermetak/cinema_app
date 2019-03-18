import React from 'react'
import moment from "moment";
import ShowItem from "./ShowItem/ShowItem";



// форматирование дат и времени для вывода на странице
const formatDate = (dateString) => {
    return moment(dateString).format('HH:mm DD-MM-YYYY')
};

const ShowSchedule = props => {
    return <div className="mt-4">
        <h2>Расписание показов</h2>
        {props.shows.map(show => {
            return <p key={show.id}>{formatDate(show.start)}: {show.hall_name} {show.movie_name}</p>
            // <ShowItem show={show} name={props.name}></ShowItem>
        })}
    </div>
};


export default ShowSchedule