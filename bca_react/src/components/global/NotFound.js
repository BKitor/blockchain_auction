import { Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/notfound.css';

export default function NotFound(){
    return (
        <div className="body-container">
            <Typography variant="h1">404 Not Found</Typography>
            <br/>
            <br/>
            <Typography variant="h4">...hmm, I couldn't find that page</Typography>
            <br/>
            <Typography variant="h6"><Link to="/">&#8592; Home</Link></Typography>
        </div>
    )
}