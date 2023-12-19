/* eslint-disable no-underscore-dangle */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Select, Icon } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
import { SectionTitle } from '../Styles';
import { User, Username } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
};

const ProjectBoardIssueDetailsAssigneesReporter = ({ issue, updateIssue, projectUsers }) => {
  const { currentUser } = useCurrentUser();
  const { isAdmin } = currentUser;

  const getUserById = userId => projectUsers.find(user => user._id === userId);

  const userOptions = projectUsers.map(user => ({ value: user._id, label: user.name }));
  return (
    <Fragment>
      <SectionTitle>Assignees</SectionTitle>
      <Select
        variant="empty"
        dropdownWidth={343}
        placeholder="Unassigned"
        name="assignees"
        value={issue.users[0] && issue.users[0]._id}
        options={userOptions}
        onChange={userId => {
          updateIssue({ userIds: [userId], users: [getUserById(userId)] });
        }}
        renderValue={({ value: userId, removeOptionValue }) =>
          renderUser(getUserById(userId), true, removeOptionValue)
        }
        renderOption={({ value: userId }) => renderUser(getUserById(userId), false)}
      />

      <SectionTitle>Reporter</SectionTitle>
      {}
      <Select
        variant="empty"
        dropdownWidth={343}
        withClearValue={false}
        name="reporter"
        value={issue.reporterId}
        options={userOptions}
        onChange={userId => updateIssue({ reporterId: userId })}
        isEdit={isAdmin}
        renderValue={({ value: userId }) => renderUser(getUserById(userId), true, null, true)}
        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
      />
    </Fragment>
  );
};

const renderUser = (user, isSelectValue, removeOptionValue, isNonEdit) => (
  <User
    key={user._id}
    isNonEdit={isNonEdit}
    title={isNonEdit && 'Only admins can change'}
    isSelectValue={isSelectValue}
    withBottomMargin={!!removeOptionValue}
    onClick={() => removeOptionValue && removeOptionValue()}
  >
    <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
    <Username>{user.name}</Username>
    {removeOptionValue && <Icon type="close" top={1} />}
  </User>
);

ProjectBoardIssueDetailsAssigneesReporter.propTypes = propTypes;

export default ProjectBoardIssueDetailsAssigneesReporter;
