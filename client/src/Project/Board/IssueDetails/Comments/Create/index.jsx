/* eslint-disable no-underscore-dangle */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import useCurrentUser from 'shared/hooks/currentUser';
import toast from 'shared/utils/toast';

import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';

const propTypes = {
  issueId: PropTypes.number.isRequired,
  fetchIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId, fetchIssue, projectUsers }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');

  const { currentUser } = useCurrentUser();

  const handleCommentCreate = async () => {
    try {
      setCreating(true);
      await api.post(`/comments`, { body, issue: issueId, user: currentUser._id });
      await fetchIssue();
      setFormOpen(false);
      setCreating(false);
      setBody('');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Create>
      {currentUser && <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} />}
      <Right>
        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isCreating}
            onSubmit={handleCommentCreate}
            onCancel={() => setFormOpen(false)}
            projectUsers={projectUsers}
          />
        ) : (
          <Fragment>
            <FakeTextarea onClick={() => setFormOpen(true)}>Add a comment...</FakeTextarea>
            <ProTip setFormOpen={setFormOpen} />
          </Fragment>
        )}
      </Right>
    </Create>
  );
};

ProjectBoardIssueDetailsCommentsCreate.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsCreate;
