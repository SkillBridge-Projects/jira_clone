/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import { sortByNewest } from 'shared/utils/javascript';

import Create from './Create';
import Comment from './Comment';
import { Comments, Title } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  fetchIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsComments = ({ issue, fetchIssue, projectUsers }) => (
  <Comments>
    <Title>Comments</Title>
    <Create projectUsers={projectUsers} issueId={issue._id} fetchIssue={fetchIssue} />

    {sortByNewest(issue.comments, 'createdAt').map(comment => (
      <Comment projectUsers={projectUsers} key={comment._id} comment={comment} fetchIssue={fetchIssue} />
    ))}
  </Comments>
);

ProjectBoardIssueDetailsComments.propTypes = propTypes;

export default ProjectBoardIssueDetailsComments;
