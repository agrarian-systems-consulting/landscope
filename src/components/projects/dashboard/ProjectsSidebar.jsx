import React, { Fragment, useContext } from 'react';
import { Input, Menu, Button, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../../app/layout/App';

export const ProjectsSidebar = ({
  setSearch,
  setFilterCategory,
  setFilterStatus,
  filterCategory,
  statusCategory,
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

  const filterStatus = ['Ongoing', 'In trial', 'Solved'];

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
      </Menu>

      <Menu vertical fluid>
        <Menu.Item
          active={filterCategory === ''}
          onClick={(e) => {
            setFilterCategory('');
            setSearch('');
          }}
        >
          All status
          {filterCategory === '' && <Icon name='filter' />}
        </Menu.Item>
        {filterStatus.map((status, index) => {
          return (
            <Menu.Item
              key={index}
              active={filterStatus === status}
              onClick={(e) => {
                setFilterStatus(status);
              }}
            >
              {status}
              {filterStatus === status && <Icon name='filter' />}
            </Menu.Item>
          );
        })}
      </Menu>

      <Menu vertical fluid>
        <Menu.Item
          active={filterCategory === ''}
          onClick={(e) => {
            setFilterCategory('');
            setSearch('');
          }}
        >
          All crops
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
        <Button as={NavLink} to='/case/news' fluid color='yellow'>
          Add new case
        </Button>
      )}
    </Fragment>
  );
};
