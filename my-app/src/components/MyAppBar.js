import React from 'react';
import {useHistory} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';

export function MyAppBar() {
    const history = useHistory();
    const gotoHomeClicked = () => {
        const regex = new RegExp(`${process.env.PUBLIC_URL.substring(1)}\\/\\w+`);
        let homePage = regex.exec(window.location);
        if(!homePage){
            return;
        }
        history.push(`${process.env.PUBLIC_URL}/`)
    }

    return(
        <AppBar color={'primary'} position={'sticky'}>
            <Toolbar>
                <Tooltip title={'Go to home page'}>
                    <IconButton onClick={gotoHomeClicked} color={'inherit'}>
                        <HomeIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}

export default MyAppBar;