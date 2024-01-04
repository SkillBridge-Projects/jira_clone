/* eslint-disable no-underscore-dangle */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import useCurrentUser from 'shared/hooks/currentUser';
import toast from 'shared/utils/toast';

import { mentionedUserProvider } from 'shared/hooks/mentionedUser';
import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';

const propTypes = {
  issueId: PropTypes.number.isRequired,
  fetchIssue: PropTypes.func.isRequired,
  projectUsers: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId, fetchIssue, projectUsers }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');

  const { currentUser } = useCurrentUser();
  const [mentionedUser, setMentionedUser] = useState(null);
  const mentionedUserDeatils = projectUsers.find(user => user._id === mentionedUser);
  const mentionedUserMail = mentionedUserDeatils ? mentionedUserDeatils.email : null;

  const handleCommentCreate = async () => {
    try {
      setCreating(true);
      await api.post(`/comments`, {
        body,
        issue: issueId,
        user: currentUser._id,
        userName: currentUser.name,
        mentionedUserMail,
      });
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
          <mentionedUserProvider value={{ mentionedUser, setMentionedUser }}>
            <BodyForm
              value={body}
              onChange={setBody}
              isWorking={isCreating}
              onSubmit={handleCommentCreate}
              onCancel={() => setFormOpen(false)}
              projectUsers={projectUsers}
              setMentionedUser={setMentionedUser}
            />
          </mentionedUserProvider>
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
