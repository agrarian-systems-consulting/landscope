import React from 'react';
import { Field, getIn } from 'formik';

const getFormikFieldError = (form, field) => {
  const { name } = field;
  const { serverValidation } = form.status || {};
  const touched = getIn(form.touched, name);
  const checkTouched = serverValidation ? !touched : touched;
  return checkTouched && getIn(form.errors, name);
};

const setFormikFieldValue = (form, name, value, shouldValidate) => {
  form.setFieldValue(name, value, shouldValidate);
  form.setFieldTouched(name, true, shouldValidate);
};

const FormField = ({ component, componentProps = {}, ...fieldProps }) => (
  <Field
    {...fieldProps}
    render={(props) => {
      var { id } = componentProps;
      var { field, form } = props;
      var { name } = field;
      if (!id) {
        id = 'form_field_' + name; 
      }
  

      const error = getFormikFieldError(form, field);
      
      componentProps.id = id;
      componentProps.error = error;


      return React.createElement(component, {
        ...componentProps,
        ...field,
        ...props,
        onChange: (e, { name, value }) => {
          setFormikFieldValue(form, name, value, true);
        },
        onBlur: form.handleBlur,
      });
    }}
  />
);

export default FormField;
