/* eslint-disable no-underscore-dangle */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button } from 'shared/components';

import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';

const propTypes = {
  issueId: PropTypes.string.isRequired,
  projectUsers: PropTypes.array.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetails = ({
  issueId,
  projectUsers,
  fetchProject,
  updateLocalProjectIssues,
  modalClose,
}) => {
  const [{ data, error, setLocalData }, fetchIssue] = useApi.get(`/issues/${issueId}`);

  setTimeout(() => {
    const targetComment = document.getElementById(window.location.hash.substring(1));
    if (targetComment) {
      targetComment.scrollIntoView({ behavior: 'smooth' });
      targetComment.style.boxShadow =
        'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px';
      setTimeout(() => {
        targetComment.style.boxShadow = 'none';
      }, 10000);
      document.addEventListener('mousemove', () => {
        targetComment.style.boxShadow = 'none';
      });
    }
  }, 1000);

  if (!data) return <Loader />;
  if (error) return <PageError />;

  const { issue } = data;

  const updateLocalIssueDetails = fields =>
    setLocalData(currentData => ({ issue: { ...currentData.issue, ...fields } }));

  const updateIssue = updatedFields => {
    api.optimisticUpdate(`/issues/${issueId}`, {
      updatedFields,
      currentFields: issue,
      setLocalData: fields => {
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(issue._id, fields);
      },
    });
  };

  return (
    <Fragment>
      <TopActions>
        <Type issue={issue} updateIssue={updateIssue} />
        <TopActionsRight>
          <CopyLinkButton variant="empty" />
          <Delete issue={issue} fetchProject={fetchProject} modalClose={modalClose} />
          <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <Left>
          <Title issue={issue} updateIssue={updateIssue} />
          <Description projectUsers={projectUsers} issue={issue} updateIssue={updateIssue} />
          <Comments projectUsers={projectUsers} issue={issue} fetchIssue={fetchIssue} />
        </Left>
        <Right>
          <Status issue={issue} updateIssue={updateIssue} />
          <AssigneesReporter issue={issue} updateIssue={updateIssue} projectUsers={projectUsers} />
          <Priority issue={issue} updateIssue={updateIssue} />
          <EstimateTracking issue={issue} updateIssue={updateIssue} />
          <Dates issue={issue} />
        </Right>
      </Content>
    </Fragment>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;

export default ProjectBoardIssueDetails;
