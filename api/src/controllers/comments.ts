import { BadUserInputError, EntityNotFoundError, catchErrors } from 'errors';
import { Comment } from 'mongooseEntities';
import { sendMail } from '../utils/mailer';

export const create = catchErrors(async (req, res) => {
  const { userName, mentionedUserMail, ...body } = req.body;
  const issueUrl = process.env.FRONTEND_JIRA_ISSUE + body.issue;
  const comment = new Comment(body);
  await comment.save();

  if (mentionedUserMail) {
    await sendMail(
      mentionedUserMail,
      `<p>${userName} mentioned you in a comment, <br/> Link: <a href='${issueUrl}'>${issueUrl}</a></p>`,
    );
  }
  res.respond({ comment });
});

export const update = catchErrors(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new BadUserInputError({ commentId });
  }
  const comment = await Comment.updateOne({ _id: commentId }, req.body);
  if (!comment) {
    throw new EntityNotFoundError(Comment.name);
  }
  res.respond({ comment });
});

export const remove = catchErrors(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new BadUserInputError({ commentId });
  }
  const comment = await Comment.deleteOne({ _id: commentId });
  res.respond({ comment });
});
