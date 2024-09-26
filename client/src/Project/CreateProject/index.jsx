/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import { ProjectCategory, ProjectCategoryCopy } from 'shared/constants/projects';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form } from 'shared/components';

import { FormCont, FormHeading, FormElement, ActionButton, Actions } from './Styles';

const propTypes = {
  // fetchProject: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectCreate = ({ modalClose, onCreate }) => {
  const [{ isCreating }, createProject] = useApi.post(`/project`);

  return (
    <Form
      initialValues={{
        name: '',
        url: '',
        category: '',
      }}
      validations={{
        name: [Form.is.required(), Form.is.maxLength(100)],
        url: Form.is.url(),
        category: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await createProject(values);
          modalClose();
          toast.success('Changes have been saved successfully.');
          onCreate();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormCont>
        <FormElement>
          <FormHeading>Create Project</FormHeading>

          <Form.Field.Input name="name" label="Name" data-testid="create project:Name" />
          <Form.Field.Input name="url" label="URL" data-testid="create project:URL"/>
          <Form.Field.TextEditor
            name="description"
            label="Description"
            tip="Describe the project in as much detail as you'd like."
            data-testid="create project:Description"
          />
          <Form.Field.Select name="category" label="Project Category" options={categoryOptions} />

          <Actions>
            <ActionButton data-testid="create project:Create" type="submit" variant="primary" isWorking={isCreating} >
              Create
            </ActionButton>
            <ActionButton data-testid="create project:Cancel" type="submit" variant="empty" onClick={modalClose}>
              Cancel
            </ActionButton>
          </Actions>
        </FormElement>
      </FormCont>
    </Form>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

ProjectCreate.propTypes = propTypes;

export default ProjectCreate;
