import { Comment, IIssue, Issue, User } from 'mongooseEntities';
import { BadUserInputError, CustomError, EntityNotFoundError, catchErrors } from 'errors';

import { FRONT_END_URLS } from 'utils/urls';
import { issueCreatedTemplate } from 'utils/mailTemplates';
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
  const assignee = await User.findById(issue.users[0]);
  const author = await User.findById(issue.authorId);
  await issue.save();
  const issueUrl = process.env.FRONTEND_JIRA_BASE_URL + FRONT_END_URLS.issues + issue.id;
  if (!assignee) {
    throw new Error('assignee not found');
  }
  const user = await User.findById(issue.reporterId);
  if (!user) {
    throw new Error('User not found.');
  }
  const issueDetails = {
    title: issue.title,
    reporter: user.name,
    assignee: assignee.name,
    url: issueUrl,
  };
  const mail = issueCreatedTemplate(author?.name, issueDetails);
  sendMail(assignee?.email, mail.subject, mail.body);
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
