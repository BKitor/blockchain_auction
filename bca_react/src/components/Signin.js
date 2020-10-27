import React, { useState } from 'react';
import { Button } from '@material-ui/core';
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
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';

import '../styles/signin.css';

const emails = ['16jw98@queensu.ca', 'other_user@gmail.com'];

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export default function Signin() {
    const [signinOpen, setSigninOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    const [selectedValue, setSelectedValue] = React.useState(emails[0]);

    const handleSignInClick = () => {
        setSigninOpen(true);
    }

    const handleSignUpClick = () => {
        setSignupOpen(true);
    }

    const handleClose = () => {
        setSigninOpen(false);
        setSignupOpen(false);
    }

    return (
        <div className="home">
            <h1>Sign in page </h1>
            <Button onClick={handleSignInClick}>Sign In</Button>
            <Button onClick={handleSignUpClick}>Signup</Button>
            <div>
                <a href="/">Forgot your password?</a>
            </div>
            <SigninPopUp selectedValue={selectedValue} open={signinOpen} onClose={handleClose} />
            <SignupPopUp selectedValue={selectedValue} open={signupOpen} onClose={handleClose} />

        </div>
    )
}

function SigninPopUp(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Select an Account:</DialogTitle>
            <List>
                {emails.map((email) => (
                    <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={email} />
                    </ListItem>
                ))}

                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemAvatar>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add account" />
                </ListItem>
            </List>
        </Dialog>
    );
}


function SignupPopUp(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const handleSignUp = (value) => {
        alert("New User Signing up!")
        onClose(value);
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Sign up from a new account</DialogTitle>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Password"
                type="password"
            /> <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Confirm Password"
                type="password"
            />
            <Button onClick={handleSignUp}>Sign up!</Button>
        </Dialog>
    );
}