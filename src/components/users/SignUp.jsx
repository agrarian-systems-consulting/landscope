import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../app/layout/App';
import { firebaseAuth } from '../../firebase/firebaseAuth';
import {
  Grid,
  Segment,
  Button,
  Form,
  Message,
  Divider,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SemanticField from '../../app/common/form/SemanticField';

export const SignUp = () => {
  //Hooks
  let history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [firebaseError, setFirebaseError] = useState('');

  // Sign out to avoid multiple connections
  firebaseAuth.signOut();

  // Form validation handled with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("L'email est invalide")
      .required("L'email est obligatoire"),
    password: Yup.string().required('Le mot de passe est obligatoire'),
  });

  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={6}>
          <Segment.Group>
            <Segment attached='top'>
              <h5>Inscription</h5>
            </Segment>
            <Segment attached='bottom'>
              <Formik
                // Initial values are mandatory in Formik
                initialValues={{ email: '', password: '' }}
                // Handle form validation
                validationSchema={validationSchema}
                // Handle form submit
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  // Authenticate with Firebase
                  firebaseAuth
                    .createUserWithEmailAndPassword(
                      values.email,
                      values.password
                    )
                    .then((res) => {
                      dispatch({
                        type: 'LOGIN',
                        payload: res,
                      });
                      history.push('/cartographie');
                    })
                    .catch((error) => {
                      setFirebaseError(error.message || error.code);
                      setSubmitting(false);
                    });
                }}
              >
                {({
                  values,
                  errors,
                  dirty,
                  isValid,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {firebaseError && (
                      <Message info>
                        <Message.Header>Oups...</Message.Header>
                        <p>{firebaseError}</p>
                      </Message>
                    )}
                    <SemanticField
                      label='Email'
                      name='email'
                      component={Form.Input}
                    />
                    <SemanticField
                      label='Mot de passe'
                      name='password'
                      component={Form.Input}
                    />

                    <div>
                      <Button
                        primary
                        content='Créer un compte'
                        type='submit'
                        disabled={isSubmitting || !isValid || !dirty}
                        loading={isSubmitting}
                      />
                    </div>
                    <Divider />
                    <div>
                      <small>
                        En créant un compte vous acceptez les{' '}
                        <a href='/cgu' target='_blank'>
                          conditions générales d'utilisation.
                        </a>
                      </small>
                    </div>

                    {/* Uncomment following lines to debug */}
                    {/* <pre>values = {JSON.stringify(values, null, 2)}</pre>
                    <pre>errors = {JSON.stringify(errors, null, 2)}</pre>
                    <pre>
                      firebaseError = {JSON.stringify(firebaseError, null, 2)}
                    </pre> */}
                  </Form>
                )}
              </Formik>
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SignUp;
