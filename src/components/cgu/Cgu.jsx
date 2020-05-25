import React from 'react';
import { Segment, Grid } from 'semantic-ui-react';

export const Cgu = () => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={10} textAlign='justified'>
          <Segment>
            <h5>Conditions générales d'utilisation</h5>
            <p>Texte à écrire</p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
