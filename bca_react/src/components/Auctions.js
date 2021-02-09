import React, { useState } from 'react';
import { Button } from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import '../styles/auctions.css';


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