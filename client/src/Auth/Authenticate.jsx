import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import toast from 'shared/utils/toast';
import { getStoredAuthToken, storeAuthToken } from 'shared/utils/authToken';
import { Form, PageLoader, Modal } from 'shared/components';
import { ActionButton, Actions, FormElement, FormHeading } from 'Project/IssueCreate/Styles';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import ForgetPassword from 'Project/ForgetPassword';
import ResetPassword from 'Project/ResetPassword';

const Authenticate = () => {
  const history = useHistory();
  const [isLoggedIn, setLoggedIn] = useState(false);
  // const [{ isCreating }, createUser] = useApi.post('/user/create');
  const [{ isCreating: isLoggingIn }, createLogin] = useApi.post('/user/login');
  const forgetPassowordModalHelpers = createQueryParamModalHelpers('forget-password');
  const resetPassowordModalHelpers = createQueryParamModalHelpers('reset-password');
  const [showForgetPasswordForm, setShowForgetPasswordForm] = useState(null);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(null);
  const params = window.location.search.slice(1).split('&');
  const [email, setEmail] = useState('');
  useEffect(() => {
    const authToken = getStoredAuthToken();
    if (authToken) {
      setLoggedIn(true);
      history.push('/');
    }
    if (params[0] === 'modal-forget-password=true') setShowForgetPasswordForm(true);
    if (params[0] === 'modal-reset-password=true') setShowResetPasswordForm(true);
  }, [history, params]);

  if (!isLoggedIn)
    return (
      <React.Fragment>
        <Form
          initialValues={{
            email: '',
            password: '',
          }}
          validations={{
            email: [Form.is.required(), Form.is.email(), Form.is.match(value => setEmail(value))],
            password: [Form.is.required()],
          }}
          onSubmit={async (values, form) => {
            try {
              const { authToken } = await createLogin({
                ...values,
              });
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
              <ActionButton type="submit" variant="primary" isWorking={isLoggingIn}>
                Login User
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => {
                  setShowForgetPasswordForm(true);
                  forgetPassowordModalHelpers.open();
                }}
                variant="secondary"
              >
                Forget Password
              </ActionButton>
            </Actions>
          </FormElement>
        </Form>
        {showForgetPasswordForm && forgetPassowordModalHelpers.open && (
          <Modal
            isOpen
            testid="modal:forget-password"
            width={600}
            onClose={() => {
              setShowForgetPasswordForm(null);
              forgetPassowordModalHelpers.close();
            }}
            renderContent={modal => (
              <ForgetPassword
                modalClose={modal.close}
                onEdit={forgetPassowordModalHelpers.close}
                setShowForgetPasswordForm={setShowForgetPasswordForm}
                email={email}
              />
            )}
          />
        )}
        {showResetPasswordForm && resetPassowordModalHelpers.open && (
          <Modal
            isOpen
            testid="modal:reset-password"
            width={600}
            onClose={() => {
              setShowResetPasswordForm(null);
              resetPassowordModalHelpers.close();
            }}
            renderContent={modal => (
              <ResetPassword
                modalClose={modal.close}
                onEdit={resetPassowordModalHelpers.close}
                setShowResetPasswordForm={setShowResetPasswordForm}
                params={params}
              />
            )}
          />
        )}
      </React.Fragment>
    );

  return <PageLoader />;
};

export default Authenticate;
