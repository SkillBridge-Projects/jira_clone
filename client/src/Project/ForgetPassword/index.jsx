/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form } from 'shared/components';

import { FormHeading, FormElement, Divider, Actions, ActionButton } from './Stlyes';

const propTypes = {
  onEdit: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ForgetPassword = ({ onEdit, modalClose, setShowForgetPasswordForm, email }) => {
  const [{ isCreating }, forgetPassword] = useApi.post(`/user/forget-password`);
  return (
    <Form
      enableReinitialize
      initialValues={{
        email,
      }}
      validations={{
        email: [Form.is.required(), Form.is.email()],
      }}
      onSubmit={async (values, form) => {
        try {
          await forgetPassword({ email })
          toast.success('Check your mail to reset your password');
          onEdit();
          setShowForgetPasswordForm(false);
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Forget Password</FormHeading>
        <Divider />
        <Form.Field.Input name="email" label="Enter Email" placeholder="Enter Your Email" />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            Forget Password
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

ForgetPassword.propTypes = propTypes;

export default ForgetPassword;
