import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Error404(props) {
    const {type, identifier} = props;
    return (
        <>
            <Typography variant="h1" align='center'>404</Typography>
            <Typography variant="h5" align='center'>{type} {identifier} not found</Typography>
        </>
    )
}