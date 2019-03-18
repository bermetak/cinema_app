import React from 'react';
import {NavLink} from 'react-router-dom'


const Card = props => {
    return <div className={"card mt-3 text-center text-sm-left " + (props.className ? props.className : "")}>
        {props.image ? <img className="card-img-top" src={props.image} alt='Фотография'/> : null}
        {props.link ? <NavLink to={props.link}>
            {props.header || props.text || props.linkUrl ? <div className="card-body">
                {props.header ? <h5 className="card-title">{props.header}</h5> : null}
                {props.text ? <p className="card-text">{props.text}</p> : null}

            </div> : null}
        </NavLink> : null}
    </div>
};


export default Card;