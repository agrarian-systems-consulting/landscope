import React, { Fragment } from 'react';
import { Form, Header } from 'semantic-ui-react';
import SemanticField from '../../../app/common/form/SemanticField';

export const ProjectInnerForm = (values) => {
  return (
    <Fragment>
      <SemanticField label='Nom du projet' name='name' component={Form.Input} />

      <SemanticField
        rows={4}
        label='Description'
        name='main_objective'
        component={Form.TextArea}
      />

      <Header color='teal' as={'h5'}>
        Approche paysagère
      </Header>
      <SemanticField
        label='Accord formel entre les parties prenantes avec des droits et des responsabilités clairs'
        name='crit_formal_agreement'
        component={Form.Checkbox}
      />
      <SemanticField
        label='Engagement international formel pour ralentir la déforestation ou accélérer la régénération des forêts'
        name='crit_int_commitment'
        component={Form.Checkbox}
      />
      <SemanticField
        label='Diagnostic initial sur le paysage'
        name='crit_baseline'
        component={Form.Checkbox}
      />
      <SemanticField
        label="Le plan d'aménagement du paysage a été approuvé et il contient des objectifs de performance"
        name='crit_landscape_plan_agreed'
        component={Form.Checkbox}
      />
      <SemanticField
        label="Le plan d'aménagement du paysage a été mis en oeuvre"
        name='crit_landscape_plan_implemented'
        component={Form.Checkbox}
      />
      <SemanticField
        label='Plateforme de gouvernance multipartite'
        name='crit_governance'
        component={Form.Checkbox}
      />
      <SemanticField
        label='Suivi-évaluation participatif'
        name='crit_parti_monitoring'
        component={Form.Checkbox}
      />
      <SemanticField
        label='Renforcement des capacités des parties prenantes'
        name='crit_strenth_capacity'
        component={Form.Checkbox}
      />

      <Form.Group>
        <SemanticField label='Pays' name='country' component={Form.Input} />
        <SemanticField
          label='Ville, Village'
          name='city'
          component={Form.Input}
        />
      </Form.Group>
      <SemanticField
        label='Surface concernée'
        name='area'
        component={Form.Input}
      />

      <Form.Group>
        <SemanticField
          label='Année de début'
          name='year_start'
          placeholder='2018'
          component={Form.Input}
        />
        <SemanticField
          label='Année de fin'
          name='year_end'
          placeholder='2021'
          component={Form.Input}
        />
      </Form.Group>
      <SemanticField
        label='Financements'
        name='funds'
        component={Form.TextArea}
      />
      <SemanticField
        label='Parties prenantes'
        name='actors'
        placeholder='Séparer les acteurs par une virgule'
        component={Form.TextArea}
      />
      <SemanticField
        label='Filières concernées'
        name='commodities'
        id='commodities'
        fluid
        selection
        multiple={true}
        clearable
        component={Form.Dropdown}
        options={[
          { key: 'beef', value: 'Boeuf', text: 'Boeuf' },
          { key: 'cocoa', value: 'Cacao', text: 'Cacao' },
          { key: 'palm_oil', value: 'Huile de palme', text: 'Huile de palme' },
          { key: 'rubber', value: 'Hévéa', text: 'Hévéa' },
          { key: 'soybean', value: 'Soja', text: 'Soja' },
          {
            key: 'wood_pulp',
            value: 'Bois et pâte à papier',
            text: 'Bois et pâte à papier',
          },
          { key: 'coffee', value: 'Café', text: 'Café' },
        ]}
      />
      <Header color='teal' as={'h5'}>
        Contacts du projet
      </Header>

      <SemanticField label='Nom' name='contact' component={Form.Input} />
      <Form.Group>
        <SemanticField label='Téléphone' name='phone' component={Form.Input} />
        <SemanticField label='Email' name='mail' component={Form.Input} />
      </Form.Group>
      <SemanticField
        label='Liens externes'
        name='links'
        placeholder='Séparer les liens par une virgule'
        component={Form.TextArea}
      />
    </Fragment>
  );
};
