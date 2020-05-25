import React from 'react';
import { Label } from 'semantic-ui-react';

const CommoditiesList = ({ commodities }) => {
  return (
    <Label.Group>
      {commodities.split(',').map((commodity) => (
        <Label basic>{commodity}</Label>
      ))}
    </Label.Group>
  );
};

export default CommoditiesList;
