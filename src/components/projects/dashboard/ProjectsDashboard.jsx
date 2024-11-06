import React, { useState, Fragment, useEffect } from 'react';
import { Grid, Breadcrumb, Placeholder, Segment } from 'semantic-ui-react';

import { ProjectsList } from './ProjectsList';
import { ProjectsSidebar } from './ProjectsSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const Projets = (props) => {
  // Hooks to local state
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // Effect hook
  useEffect(() => {
    try {
      fetch(
        'https://map.geomatick.com/geoserver/apf/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=apf:projects&outputFormat=application/json',
        {
          headers: {
            Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
          },
        }
      ).then(async (response) => {
        const data = await response.json();
        setProjects(data.features);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, []);

  // Filter Projects hooks
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Method to filter projects
  const filteredProjects = () => {
    // Spread previous state
    let filteredProjects = [...projects];

    // Filter with search bar value
    if (search !== '') {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.properties.name_project
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          project.properties.country
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    console.log(filteredProjects);

    // Filter with selected category
    //TODO Review this once I add commodities in the form
    if (filterCategory !== '') {
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.properties.commodities &&
          project.properties.commodities
            .replace(/,/g, ' ')
            .toLowerCase()
            .includes(filterCategory.toLowerCase())
      );
    }
    return filteredProjects;
  };

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={16}>
          <Breadcrumb>
            <Breadcrumb.Section active>Conflict cases</Breadcrumb.Section>
          </Breadcrumb>
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={4}>
          <ProjectsSidebar
            setSearch={setSearch}
            setFilterCategory={setFilterCategory}
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          <ProjectsList projects={filteredProjects()} isLoading={isLoading} />
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default Projets;
