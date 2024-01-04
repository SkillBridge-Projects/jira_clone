import { Comment, IIssue, Issue, User } from 'mongooseEntities';
import { BadUserInputError, CustomError, EntityNotFoundError, catchErrors } from 'errors';

import { sendMail } from '../utils/mailer';

export const getProjectIssues = catchErrors(async (req, res) => {
  const { searchTerm, projectId } = req.query;
  if (!searchTerm || !projectId) {
    throw new CustomError('either of one searchTerm or projectId not provided');
  }

  const issues = await Issue.find({
    project: projectId,
    title: { $in: [new RegExp(searchTerm, 'i')] },
  });
  res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const { issueId } = req.params;
  if (!issueId) {
    throw new BadUserInputError({ issueId });
  }
  const issue = await Issue.findOne({ _id: issueId }).populate('users');

  if (issue) {
    issue.comments = await Comment.find({ issue: issueId }).populate('user');
  }
  res.respond({ issue });
});

export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition(req.body);
  const issue = new Issue({ ...req.body, listPosition });
  const assignee = await User.find({ _id: issue.users[0] });
  await issue.save();
  const issueUrl = process.env.FRONTEND_JIRA_ISSUE + issue.id;
  await sendMail(
    assignee[0].email,
    `<p>Issue has been assigned, <br/> Link: <a href='${issueUrl}'>${issueUrl}</a></p>`,
  );
  res.respond({ issue });
});

export const update = catchErrors(async (req, res) => {
  const { issueId } = req.params;
  if (!issueId) {
    throw new BadUserInputError({ issueId });
  }
  const issue = await Issue.updateOne({ _id: issueId }, req.body);
  if (!issue) {
    throw new EntityNotFoundError(Issue.name);
  }
  res.respond({ issue });
});

export const remove = catchErrors(async (req, res) => {
  const { issueId } = req.params;
  if (!issueId) {
    throw new BadUserInputError({ issueId });
  }
  const issue = await Issue.deleteOne({ _id: issueId });
  res.respond({ issue });
});

const calculateListPosition = async ({ _id, status }: IIssue): Promise<number> => {
  const issues = await Issue.find({ _id, status });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};
