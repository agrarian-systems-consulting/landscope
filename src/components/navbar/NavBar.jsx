import React, { useContext, Fragment } from 'react';
import { Menu, Container, Button, Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../app/layout/App';
import { NavLink, Link } from 'react-router-dom';

export const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} to='/' exact>
          {/* <img src='/assets/logo-white.png' alt='logo' /> */}
          Rai Disputa
        </Menu.Item>

        <Fragment>
          <Menu.Item name='Cases' as={NavLink} to='/cases' exact />
          <Menu.Item name='Map' as={NavLink} to='/map' exact />
          <Menu.Item name='About' as={NavLink} to='/about' exact />
          {state.loggedIn && (
            <Menu.Item>
              <Button
                as={Link}
                to='/case/new'
                floated='right'
                color='yellow'
                content='New case'
              />
            </Menu.Item>
          )}
        </Fragment>

        {state.loggedIn ? (
          <Menu.Item position='right'>
            <Dropdown pointing='top left' text={state.user.email}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/perso/`}
                  text='Mon profil'
                  icon='user'
                />
                <Dropdown.Item
                  onClick={() => dispatch({ type: 'LOGOUT' })}
                  text='Se déconnecter'
                  icon='power'
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        ) : (
          //SignedOutMenu
          <Menu.Item position='right'>
            <Button
              basic
              inverted
              content='Se connecter'
              as={NavLink}
              to='/connexion'
            />
            <Button
              basic
              inverted
              content="S'inscrire"
              style={{ marginLeft: '0.5em' }}
              as={NavLink}
              to='/inscription'
            />
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default NavBar;
