/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form } from 'shared/components';

import { FormHeading, FormElement, Divider, Actions, ActionButton } from './Stlyes';

const UserEdit = ({ user, projects, onSave, modalClose }) => {
  const [{ isUpdating }, updateUser] = useApi.patch(`/users/${user._id}`);

  return (
    <Form
      enableReinitialize
      initialValues={{
        name: user.name,
        isAdmin: user.isAdmin,
        project: user.project._id,
      }}
      validations={{
        name: Form.is.required(),
        project: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await updateUser(values);
          toast.success(`User ${values.name} has been successfully updated.`);
          onSave();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Edit User</FormHeading>
        <Divider />
        <Form.Field.Input name="name" label="Name" placeholder="Enter User's Name" />
        <Form.Field.Select
          name="isAdmin"
          label="Is Admin"
          options={[
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]}
        />
        <Form.Field.Select
          name="project"
          label="Project"
          options={projects.map(proj => ({ value: proj._id, label: proj.name }))}
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
            Update User
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

export default UserEdit;
