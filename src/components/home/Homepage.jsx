import React, { Component } from 'react';
import {
  Segment,
  Container,
  Header,
  Image,
  Button,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Homepage extends Component {
  render() {
    return (
      <Segment inverted textAlign='center' vertical className='masthead'>
        <Container text>
          <Header as='h1' inverted>
            Landscope
          </Header>
          <Image
            size='small'
            src='/assets/logo-text-white.svg'
            alt='logo'
            style={{ margin: 'auto', marginBottom: 60 }}
          />
          <br />
          <Button as={Link} to='/about' size='huge' inverted>
            Commencer
            <Icon name='right arrow' inverted />
          </Button>
        </Container>
      </Segment>
    );
  }
}
