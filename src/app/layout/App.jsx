import React, { createContext, useReducer, useEffect, Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import NavBar from '../../components/navbar/NavBar';
import Home from '../../components/home/Homepage';
import Cartographie from '../../components/map/MapPage';
import Projets from '../../components/projects/dashboard/ProjectsDashboard';
import About from '../../components/about/About';
import SignUp from '../../components/users/SignUp';
import SignIn from '../../components/users/SignIn';
import Erreur from '../../components/Erreur';
import { Container } from 'semantic-ui-react';
import ProjectsNew from '../../components/projects/form/ProjectsNew';
import ScrollToTop from '../common/utils/ScrollToTop';
import { Cgu } from '../../components/cgu/Cgu';
import ProjectDetailPage from '../../components/projects/detail/ProjectDetailPage';

export const UserContext = createContext();

const initialState = {
  loggedIn: false,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state,
        loggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Retrieve user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || null);

    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }
  }, []);

  // Simple HOC to only allow loggedIn users
  const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        state.loggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect to='/connexion' />
        )
      }
    />
  );

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <ScrollToTop />
        <Route exact path='/' component={Home} />
        <Route
          path='/(.+)'
          render={() => (
            <Fragment>
              <NavBar />
              <Container className='main'>
                <Switch>
                  <Route path='/cartographie' component={Cartographie} />
                  <Route path='/projets' exact component={Projets} />
                  <ProtectedRoute
                    path='/projets/nouveau'
                    exact
                    component={ProjectsNew}
                  />
                  <Route path='/projets/:id' component={ProjectDetailPage} />
                  <Route path='/about' component={About} />
                  <Route path='/cgu' component={Cgu} />
                  <Route path='/inscription' component={SignUp} />
                  <Route path='/connexion' component={SignIn} />
                  <Route component={Erreur} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
