import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Container, Divider} from "@material-ui/core";

function MyFooter() {
    return (
        <div style={{marginTop: '100px', maxHeight: '50px'}}>
            <Container style={{padding: '3px'}}>
                <Divider style={{marginBottom: '3px'}} />
                <Typography variant="h6" align="center" gutterBottom>
                    this site was implemented by Gal Ben-Simhon
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                    Wix Test
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Small project for category trees
                </Typography>
            </Container>
        </div>

    );
}

export default MyFooter;