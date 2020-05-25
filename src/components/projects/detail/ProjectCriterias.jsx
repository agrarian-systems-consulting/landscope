import React from 'react';
import { List, Label } from 'semantic-ui-react';

export const ProjectCriterias = ({ project }) => {
  return (
    <List>
      <List.Item>
        <List.Content>
          {project.crit_formal_agreement ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Accord formel entre les parties prenantes avec des droits et des
          responsabilités clairs
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_int_commitment ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Engagement international formel pour ralentir la déforestation ou
          accélérer la régénération des forêts
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_baseline ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Diagnostic initial sur le paysage
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_landscape_plan_agreed ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Le plan d'aménagement du paysage a été approuvé et il contient des
          objectifs de performance
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_landscape_plan_implemented ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Le plan d'aménagement du paysage a été mis en oeuvre
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_governance ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Plateforme de gouvernance multipartite
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.parti_monitoring ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Suivi-évaluation participatif
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          {project.crit_strenth_capacity ? (
            <Label circular color='olive' empty />
          ) : (
            <Label circular empty />
          )}{' '}
          Renforcement des capacités des parties prenantes
        </List.Content>
      </List.Item>
    </List>
  );
};
