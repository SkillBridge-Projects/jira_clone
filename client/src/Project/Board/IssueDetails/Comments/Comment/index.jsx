/* eslint-disable no-underscore-dangle */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { formatDateTimeConversational } from 'shared/utils/dateTime';
import { ConfirmModal, TextEditedContent } from 'shared/components';
import useCurrentUser from 'shared/hooks/currentUser';
import BodyForm from '../BodyForm';
import { Comment, UserAvatar, Content, Username, CreatedAt, EditLink, DeleteLink } from './Styles';

const propTypes = {
  comment: PropTypes.object.isRequired,
  fetchIssue: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
  commentId: PropTypes.string.isRequired,
};

const ProjectBoardIssueDetailsComment = ({ comment, fetchIssue, projectUsers, commentId }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [body, setBody] = useState(comment.body);
  const { currentUser } = useCurrentUser();

  const handleCommentDelete = async () => {
    try {
      await api.delete(`/comments/${comment._id}`);
      await fetchIssue();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCommentUpdate = async () => {
    try {
      setUpdating(true);
      await api.put(`/comments/${comment._id}`, { body });
      await fetchIssue();
      setUpdating(false);
      setFormOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Comment data-testid="issue-comment" id={commentId}>
      <UserAvatar name={comment.user.name} avatarUrl={comment.user.avatarUrl} />
      <Content>
        <Username>{comment.user.name}</Username>
        <CreatedAt>{formatDateTimeConversational(comment.createdAt)}</CreatedAt>

        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isUpdating}
            onSubmit={handleCommentUpdate}
            onCancel={() => setFormOpen(false)}
            projectUsers={projectUsers}
          />
        ) : (
          <Fragment>
            <TextEditedContent
              content={comment.body}
              onClick={event => {
                if (currentUser && currentUser._id !== comment.user._id) return;
                if (event.target.tagName !== 'A') {
                  setFormOpen(true);
                }
              }}
            />

            {currentUser && currentUser._id === comment.user._id && (
              <Fragment>
                <EditLink onClick={() => setFormOpen(true)}>Edit</EditLink>
                <ConfirmModal
                  title="Are you sure you want to delete this comment?"
                  message="Once you delete, it's gone for good."
                  confirmText="Delete comment"
                  onConfirm={handleCommentDelete}
                  renderLink={modal => <DeleteLink onClick={modal.open}>Delete</DeleteLink>}
                />
              </Fragment>
            )}
          </Fragment>
        )}
      </Content>
    </Comment>
  );
};

ProjectBoardIssueDetailsComment.propTypes = propTypes;

export default ProjectBoardIssueDetailsComment;
