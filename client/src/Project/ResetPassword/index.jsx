/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'shared/utils/toast';
import { Form } from 'shared/components';

import { FormHeading, FormElement, Divider, Actions, ActionButton } from './Stlyes';

const propTypes = {
  onEdit: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ResetPassword = ({ onEdit, modalClose, setShowResetPasswordForm /* , params */ }) => {
  return (
    <Form
      enableReinitialize
      initialValues={{
        newPassword: '',
        confirmPassword: '',
      }}
      validations={{
        newPassword: [Form.is.required(), Form.is.minLength(8)],
        confirmPassword: [
          Form.is.required(),
          Form.is.match((value, fieldvalues) => {
            return value === fieldvalues.newPassword;
          }, 'Confirm Password Should Match With Password'),
        ],
      }}
      onSubmit={async (values, form) => {
        try {
          toast.success('Password reseted, Login with your new credentials');
          onEdit();
          setShowResetPasswordForm(false);
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Reset Account Password</FormHeading>
        <Divider />
        <Form.Field.Input
          name="newPassword"
          type="password"
          label="Enter New Password"
          placeholder="Password"
        />
        <Form.Field.Input
          name="confirmPassword"
          type="password"
          label="Re-Enter New Password"
          placeholder="Confirm Password"
        />
        <Actions>
          <ActionButton type="submit" variant="primary">
            Reset Password
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

ResetPassword.propTypes = propTypes;

export default ResetPassword;
