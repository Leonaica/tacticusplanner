﻿import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { ILegendaryEvent } from '../../models/interfaces';
import { LeProgress } from '../../shared-components/le-progress';

export function MyProgressDialog({ legendaryEvent }: { legendaryEvent: ILegendaryEvent}) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                My Progress
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            My Progress
                        </Typography>
                    </Toolbar>
                </AppBar>
                <LeProgress legendaryEvent={legendaryEvent}/>
            </Dialog>
        </div>
    );
}
