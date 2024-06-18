import React from "react";
import "./Header.css"
const Header = (props) => {

    return (
        <div className="Header_Section">
            <h1 className="Heading">{props.name}</h1>
        </div>
    )
}

export default Header