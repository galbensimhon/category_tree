import React from 'react';
import {Container, Link} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';

export function MyHeader() {
    return(
        <div style={{marginTop: '40px'}} >
            <Container maxWidth={'md'}>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    welcome to my site :) <br/>
                    This site have the ability to contain different category trees.<br/>
                    the frontend involved {<Link underline={'always'} href={'https://reactjs.org/'}>React.js</Link>},
                    {<Link underline={'always'} href={'https://material-ui.com/'}>Material-UI</Link>} framework.<br/>
                    The backend involved {<Link underline={'always'} href={'https://expressjs.com/'}>express.js</Link>} by
                    : {<Link underline={'always'} href={'https://nodejs.org/en/'}>Node.js</Link>} <br/>
                    Hope u will like it!! <br/>
                </Typography>
            </Container>
        </div>
    )
}

export default MyHeader;