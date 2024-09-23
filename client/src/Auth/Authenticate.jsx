import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import toast from 'shared/utils/toast';
import { getStoredAuthToken, storeAuthToken } from 'shared/utils/authToken';
import { Form, PageLoader } from 'shared/components';
import { ActionButton, Actions, FormElement, FormHeading } from 'Project/IssueCreate/Styles';

const Authenticate = () => {
  const history = useHistory();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [{ isCreating }, createUser] = useApi.post('/user/create');
  const [{ isCreating: isLoggingIn }, createLogin] = useApi.post('/user/login');

  useEffect(() => {
    const authToken = getStoredAuthToken();
    if (authToken) {
      setLoggedIn(true);
      history.push('/');
    }
  }, [history]);

  if (!isLoggedIn) return (
    <React.Fragment>
     <Form
      initialValues={{
        email: '',
        password: ''
      }}
      validations={{
        email: [Form.is.required(), Form.is.email()],
        password: [Form.is.required()]
      }}
      onSubmit={async (values, form) => {
        try {
          const { authToken } = await createLogin({
            ...values
          })
          storeAuthToken(authToken);
          toast.success(`User ${values.email} logged in sucessfully`);
          history.push('/');
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
     >
      <FormElement>
        <FormHeading>Login User</FormHeading>
        <Form.Field.Input 
          name="email"
          label="Enter Email"
          placeholder="Please Enter Your Email"
        />
        <Form.Field.Input 
          name="password"
          label="Enter Password"
          placeholder="Please Enter Your Password"
          type="password"
        />
        <Actions>
          <ActionButton type="submit" variant="primary" data-testid="form-field:login-button" isWorking={isLoggingIn}>
            Login User
          </ActionButton>
        </Actions>
      </FormElement>
     </Form>
    </React.Fragment>
  )

  return <PageLoader />;
};

export default Authenticate;
