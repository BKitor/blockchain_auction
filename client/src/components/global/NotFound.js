import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/notfound.css';

export default function NotFound(){
    return (
        <div className="body-container">
            <h1>...hmm, I couldn't find that one</h1>
            <Link to="/">&#8592; Back to home</Link>
        </div>
    )
}