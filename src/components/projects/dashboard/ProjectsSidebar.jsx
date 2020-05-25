import React, { Fragment, useContext } from 'react';
import { Input, Menu, Button, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../../app/layout/App';

export const ProjectsSidebar = ({
  setSearch,
  setFilterCategory,
  filterCategory,
}) => {
  const { state, dispatch } = useContext(UserContext);

  const filterCategories = [
    'Boeuf',
    'Cacao',
    'Huile de palme',
    'Hévéa',
    'Soja',
    'Bois et pâte à papier',
    'Café',
  ];

  return (
    <Fragment>
      <Menu vertical fluid>
        <Menu.Item>
          <Input
            placeholder='Titre...'
            className='icon'
            icon='search'
            onChange={(e) => setSearch(e.target.value)}
          />
        </Menu.Item>

        <Menu.Item
          active={filterCategory === ''}
          onClick={(e) => {
            setFilterCategory('');
            setSearch('');
          }}
        >
          Toutes les commodités
          {filterCategory === '' && <Icon name='filter' />}
        </Menu.Item>

        {filterCategories.map((category, index) => {
          return (
            <Menu.Item
              key={index}
              active={filterCategory === category}
              onClick={(e) => {
                setFilterCategory(category);
              }}
            >
              {category}
              {filterCategory === category && <Icon name='filter' />}
            </Menu.Item>
          );
        })}
      </Menu>
      {state.loggedIn && (
        <Button as={NavLink} to='/projets/nouveau' fluid color='yellow'>
          Créer un projet
        </Button>
      )}
    </Fragment>
  );
};
