import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import checkEnvironment from '@/util/check-environment';
import { useAppSelector } from '@/src/hooks';

const host = checkEnvironment();

const InviteModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [isMailSending, setMailSending] = useState(false);
  const board = useAppSelector((state) => state.board.board);

  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

  const handleClick = async () => {
    setMailSending(true);
    await sendEmail();
    setMailSending(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validate();
  };
  const validate = () => {
    if (!validEmail.test(email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
  };

  const sendEmail = async () => {
    const url = `${host}/api/mail`;

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ email, boardId: board._id })
    });

    const inJSON = await response.json();

    if (inJSON.status === 200) {
      setIsOpen(false);
      setEmail('');
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="small" sx={{ ml: 1 }} variant="contained">
        Invite
      </Button>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} fullWidth maxWidth="xs">
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <TextField
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        {emailErr && <p>{emailErr}</p>}
        <DialogActions sx={{ p: '0 24px 24px' }}>
          <Button disabled={!validEmail.test(email)} onClick={handleClick} variant="contained">
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InviteModal;
