/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import {
  IssueType,
  IssueStatus,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
} from 'shared/constants/issues';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { Form, IssueTypeIcon, Icon, Avatar, IssuePriorityIcon } from 'shared/components';

import {
  FormHeading,
  FormElement,
  SelectItem,
  SelectItemLabel,
  Divider,
  Actions,
  ActionButton,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
};

const ProjectIssueCreate = ({ project, fetchProject, onCreate, modalClose, projectUsers }) => {
  const [{ isCreating }, createIssue] = useApi.post('/issues');

  const { currentUserId } = useCurrentUser();

  return (
    <Form
      enableReinitialize
      initialValues={{
        type: IssueType.TASK,
        title: '',
        description: '',
        reporterId: currentUserId,
        userIds: [],
        priority: IssuePriority.MEDIUM,
      }}
      validations={{
        type: Form.is.required(),
        title: [Form.is.required(), Form.is.maxLength(200)],
        reporterId: Form.is.required(),
        priority: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
        try {
          await createIssue({
            ...values,
            status: IssueStatus.BACKLOG,
            project: project._id,
            users: [{ _id: values.userIds }],
            authorId: currentUserId,
          });
          await fetchProject();
          toast.success('Issue has been successfully created.');
          onCreate();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Create issue</FormHeading>
        <Form.Field.Select
          name="type"
          label="Issue Type"
          tip="Start typing to get a list of possible matches."
          options={typeOptions}
          renderOption={renderType}
          renderValue={renderType}
        />
        <Divider />
        <Form.Field.Input
          name="title"
          label="Short Summary"
          tip="Concisely summarize the issue in one or two sentences."
          data-testid="Issue Create:short-summary"
        />
        <Form.Field.TextEditor
          name="description"
          label="Description"
          tip="Describe the issue in as much detail as you'd like."
          mentionUsers={projectUsers}
        />
        <Form.Field.Select
          name="reporterId"
          label="Reporter"
          data-testid="IssueCreate:Reporter-search"
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          name="userIds"
          label="Assignees"
          tio="People who are responsible for dealing with this issue."
          options={userOptions(project)}
          renderOption={renderUser(project)}
          renderValue={renderUser(project)}
        />
        <Form.Field.Select
          name="priority"
          label="Priority"
          tip="Priority in relation to other issues."
          options={priorityOptions}
          renderOption={renderPriority}
          renderValue={renderPriority}
        />
        <Actions>
          <ActionButton type="submit" variant="primary" data-testid="IssueCreate:create-issue-button" isWorking={isCreating}>
            Create Issue
          </ActionButton>
          <ActionButton type="button" variant="empty" data-testid="IssueCreate:cancel-button" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

const typeOptions = Object.values(IssueType).map(type => ({
  value: type,
  label: IssueTypeCopy[type],
}));

const priorityOptions = Object.values(IssuePriority).map(priority => ({
  value: priority,
  label: IssuePriorityCopy[priority],
}));

const userOptions = project => project.users.map(user => ({ value: user._id, label: user.name }));

const renderType = ({ value: type }) => (
  <SelectItem>
    <IssueTypeIcon type={type} top={1} />
    <SelectItemLabel>{IssueTypeCopy[type]}</SelectItemLabel>
  </SelectItem>
);

const renderPriority = ({ value: priority }) => (
  <SelectItem>
    <IssuePriorityIcon priority={priority} top={1} />
    <SelectItemLabel>{IssuePriorityCopy[priority]}</SelectItemLabel>
  </SelectItem>
);

const renderUser = project => ({ value: userId, removeOptionValue }) => {
  const user = project.users.find(({ _id }) => _id === userId);

  return (
    <SelectItem
      key={user._id}
      withBottomMargin={!!removeOptionValue}
      onClick={() => removeOptionValue && removeOptionValue()}
    >
      <Avatar size={20} avatarUrl={user.avatarUrl} name={user.name} />
      <SelectItemLabel>{user.name}</SelectItemLabel>
      {removeOptionValue && <Icon type="close" top={2} />}
    </SelectItem>
  );
};

ProjectIssueCreate.propTypes = propTypes;

export default ProjectIssueCreate;
