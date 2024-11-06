import React from 'react';
import { Table, Placeholder } from 'semantic-ui-react';
import { ProjectsListItem } from './ProjectsListItem';
import _ from 'lodash';

export const ProjectsList = ({ projects, isLoading }) => {
  // Show a placeholder table while loading projects
  const placeholderTable = _.times(10, (index) => (
    <Table.Row key={index}>
      {_.times(4, (indexCell) => (
        <Table.Cell key={indexCell}>
          <Placeholder>
            <Placeholder.Line />
          </Placeholder>
        </Table.Cell>
      ))}
    </Table.Row>
  ));

  return (
    <Table celled selectable fixed singleLine>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign='center'>Suku</Table.HeaderCell>
          <Table.HeaderCell colSpan='2'>Title</Table.HeaderCell>
          <Table.HeaderCell colSpan='2' textAlign='center'>
            Status
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading
          ? placeholderTable
          : projects &&
            projects.map((project) => (
              <ProjectsListItem key={project.id} project={project} />
            ))}
      </Table.Body>
    </Table>
  );
};
