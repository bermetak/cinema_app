import React from 'react'
import moment from "moment";




const formatDate = (dateString) => {
    return moment(dateString).format('HH:mm DD-MM-YYYY')
};

const ShowSchedule = props => {
    return <div className="mt-4">
        <h2>Расписание показов</h2>
        {props.shows.map(show => {
            return <p key={show.id}>{formatDate(show.start)}: {(props.c_type === 'hall') ?   show.movie_name : show.hall_name}</p>
        })}
    </div>
};


export default ShowSchedule