import React, { useState } from 'react';
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import '../styles/auctions.css';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function Auctions() {
    const [existingSession, setExistingSession] = useState(false);
    const [sessionCode, setSessionCode] = useState(null);

    const handleExistingAuction = () => {
        setExistingSession(true);
    }

    const handleClose = () => {
        setExistingSession(false);
    }

    const handleNewAuction = () => {
        alert('Creating a new auction')
    }

    return (
        <div className='home'>
            <h1>Auction Page</h1>
            {
                sessionCode == null ?
                    <div>
                        <h2>
                            You are not currently in an auction!
                </h2>

                        <Button onClick={handleNewAuction}>Create your own Auction</Button>
                        <Button onClick={handleExistingAuction}>Join an Existing Auction</Button>
                    </div>
                    :
                    <div>
                        Welcome to the Auction!
                    <br>
                        </br>
                    The auction code is: {sessionCode}
                    </div>
            }
            <ExistingSessionDialog open={existingSession} onClose={handleClose} setSessionCode={setSessionCode} />
        </div>
    )
}

function ExistingSessionDialog(props) {
    const classes = useStyles();
    const { onClose, open, setSessionCode } = props;
    const [session, setSession] = useState(0);

    const handleClose = () => {
        onClose();
    };

    const handleSession = () => {
        setSessionCode(session);
        onClose();
    }

    const handleChange = (e) => {
        setSession(e.target.value);
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Enter a auction code</DialogTitle>
            <div style={{ width: '80%', margin: 'auto' }}>
                <TextField
                    onChange={handleChange}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Auction Code"
                    type="email"
                />
            </div>

            <Button onClick={handleSession}>Join Session</Button>
        </Dialog>
    );
}