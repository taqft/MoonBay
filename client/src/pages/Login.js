import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import withRoot from './modules/withRoot';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
// import { email, required } from './modules/form/validation';
// import RFTextField from './modules/form/RFTextField';
// import FormButton from './modules/form/FormButton';
// import FormFeedback from './modules/form/FormFeedback';


import Auth from '../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // reset the form's values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <Link
              href="/signup/"
              align="center"
              underline="always"
            >
              Sign Up here
            </Link>
          </Typography>
        </React.Fragment>
        {data ? (
          <Typography>
            Successful login. Play on!
          </Typography>
        ) : (
          <Box>
            <form onSubmit={handleFormSubmit} align="center">
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button
                className="btn btn-block btn-primary"
                style={{ cursor: 'pointer' }}
                type="submit"
              >
                Submit
              </button>
            </form>
          </Box>)}
        {error && (
          <Typography variant="body2" align="center">
            {error.message}
          </Typography>
        )}
      </AppForm>
      <AppFooter />
    </React.Fragment >
  );
}

export default withRoot(Login);
