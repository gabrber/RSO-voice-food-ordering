import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ReactPlayer from 'react-player';

const LandingPage: React.FC = () => {
  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignContent="center"
      direction="column"
    >
      <Grid item>
        <Typography
          variant="h2"
          style={{ paddingTop: '30px', textAlign: 'center' }}
        >
          Witamy w <strong>Teraz Pizza!</strong>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h4" style={{ textAlign: 'center' }}>
          Zapoznaj się z filmem dotyczącym Google Asystenta
        </Typography>
      </Grid>

      <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
        <ReactPlayer
          width="80%"
          controls
          style={{
            position: 'relative',
            top: 0
          }}
          url="https://www.youtube.com/watch?v=FPfQMVf4vwQ"
          config={{
            youtube: {
              playerVars: { cc_lang_pref: 'pl', cc_load_policy: 1 }
            }
          }}
        />
        {/* </div> */}
      </Grid>

      <Grid item>
        <Typography variant="h3" style={{ textAlign: 'center' }}>
          To takie proste! <br /> <strong>- Teraz Pizza - </strong> <br /> W
          Twoim asystencie Google!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
