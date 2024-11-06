import React from 'react';
import { Segment, Grid, Button, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={10} textAlign='justified'>
          <Segment.Group>
            <Segment attached='top' textAlign='left'>
              <h3>
                Accompagner les entreprises françaises dans la lutte contre la
                déforestation importée
              </h3>
            </Segment>
            <Segment attached='bottom'>
              <h5>KSI</h5>
              <p>
                Description of KSI
              </p>
       

              <h5>Mapping land conflicts in Timor Leste</h5>
              <p>
                A description of this mapping project
              </p>
           
              <Button color='blue' as={Link} to='/cartographie'>
                Explore the map
              </Button>
              <Button as={Link} to='/projets'>
                See the list of conflict cases
              </Button>
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default About;
