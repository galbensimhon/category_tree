import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
    const { text , onClickOk} = props
    const [open, setOpen] = useState(false);
    const [tempName, setTempName] = useState('')

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOk = (type) => {
        if(tempName == null || !tempName){
            alert('Please insert a valid name');
            setOpen(false);
            return;
        }
        let name = tempName.trim();
        if (name === '' || /\s/.test(name)) {
            alert('Please insert a name without spaces');
        }
        else{
            onClickOk(name, type);
        }
        setOpen(false);
    };

    return (
        <div>
            <div onClick={handleClickOpen}>{text}</div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Insert Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name:
                        <div></div>
                        (name must be without any spaces)
                    </DialogContentText>
                    <TextField autoComplete='off' autoFocus id="name" fullWidth
                        onChange={(e) => setTempName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleClickOk(text)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}