import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';

import { TrackingWidget, WatchIcon, Right, BarCont, Bar, Values } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsTrackingWidget = ({ issue }) => (
  <TrackingWidget>
    <WatchIcon type="stopwatch" size={26} top={-1} />
    <Right>
      <BarCont>
        <Bar width={calculateTrackingBarWidth(issue)} color="blue" />
        <Bar width={calculateExtraTrackingBarWidth(issue)} color="red" />
      </BarCont>
      <Values>
        <div>{issue.timeSpent ? `${issue.timeSpent}h logged` : 'No time logged'}</div>
        {renderRemainingOrEstimate(issue)}
      </Values>
    </Right>
  </TrackingWidget>
);

const extraTime = ({ timeSpent, estimate }) => {
  return timeSpent - estimate;
};

const calculateTrackingBarWidth = ({ timeSpent, timeRemaining, estimate }) => {
  if (timeSpent < estimate) {
    if (!timeSpent) {
      return 0;
    }
    if (isNil(timeRemaining) && isNil(estimate)) {
      return 100;
    }
    if (!isNil(timeRemaining)) {
      return (timeSpent / (timeSpent + timeRemaining)) * 100;
    }
    if (!isNil(estimate)) {
      return Math.min((timeSpent / estimate) * 100, 100);
    }
  } else {
    return (estimate / (estimate + extraTime({ timeSpent, estimate }))) * 100;
  }
};

const calculateExtraTrackingBarWidth = ({ timeSpent, estimate }) => {
  return (
    (extraTime({ timeSpent, estimate }) / (estimate + extraTime({ timeSpent, estimate }))) * 100
  );
};

const renderRemainingOrEstimate = ({ timeSpent, timeRemaining, estimate }) => {
  if (timeSpent > estimate) {
    return <div>{`${timeSpent - estimate}h underEstimated`}</div>;
  }
  if (isNil(timeRemaining) && isNil(estimate)) {
    return null;
  }
  if (!isNil(timeRemaining)) {
    return <div>{`${timeRemaining}h remaining`}</div>;
  }
  if (!isNil(estimate)) {
    return <div>{`${estimate}h estimated`}</div>;
  }
};

ProjectBoardIssueDetailsTrackingWidget.propTypes = propTypes;

export default ProjectBoardIssueDetailsTrackingWidget;
