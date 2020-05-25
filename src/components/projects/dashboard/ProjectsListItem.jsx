import React from 'react';
import { Icon, Button, Table, CardDescription, Label } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import CommoditiesList from '../detail/CommoditiesList';

export const ProjectsListItem = ({ project }) => {
  return (
    <Table.Row>
      <Table.Cell textAlign='center'>{project.properties.country}</Table.Cell>
      <Table.Cell colSpan='2'>
        <CardDescription as={NavLink} to={`/projets/${project.id}`}>
          {project.properties.name_project}
        </CardDescription>
      </Table.Cell>
      <Table.Cell colSpan='2' textAlign='center'>
        {
          project.properties.commodities &&
            project.properties.commodities.replace(/,/g, ', ')
          // (
          //   <CommoditiesList commodities={project.properties.commodities} />
          // )
        }
      </Table.Cell>
    </Table.Row>
  );
};
