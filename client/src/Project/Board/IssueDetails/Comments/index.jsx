/* eslint-disable no-underscore-dangle */
import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { sortByNewest } from 'shared/utils/javascript';

import Create from './Create';
import Comment from './Comment';
import { Comments, Title, CommentScroll, ActionButton } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  fetchIssue: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
  isMentionedComment: PropTypes.bool.isRequired,
};

const ProjectBoardIssueDetailsComments = ({
  issue,
  fetchIssue,
  projectUsers,
  isMentionedComment,
}) => {
  const [showComments, setShowComments] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const sortedComments = useMemo(() => sortByNewest(issue.comments, 'createdAt'), [issue.comments]);
  useEffect(() => {
    if (isMentionedComment) {
      setShowComments(sortedComments.length);
      setIsCompleted(true);
    }
  }, [isMentionedComment, sortedComments.length]);
  const renderComments = () => {
    return sortedComments
      .slice(0, showComments)
      .map(comment => (
        <Comment
          projectUsers={projectUsers}
          key={comment._id}
          commentId={comment._id}
          comment={comment}
          fetchIssue={fetchIssue}
        />
      ));
  };

  return (
    <Comments>
      <Title>Comments</Title>
      <Create projectUsers={projectUsers} issueId={issue._id} fetchIssue={fetchIssue} />
      <CommentScroll>
        {renderComments()}
        {!isCompleted && showComments < sortedComments.length && (
          <ActionButton
            type="button"
            variant="empty"
            onClick={() => {
              setShowComments(prev => prev + 3);
              if (showComments + 3 >= sortedComments.length) {
                setIsCompleted(true);
              }
            }}
          >
            Show More ▼
          </ActionButton>
        )}
      </CommentScroll>
    </Comments>
  );
};

ProjectBoardIssueDetailsComments.propTypes = propTypes;

export default ProjectBoardIssueDetailsComments;
