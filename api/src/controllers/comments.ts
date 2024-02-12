import { BadUserInputError, EntityNotFoundError, catchErrors } from 'errors';
import { Comment, User } from 'mongooseEntities';
import { sendMail } from 'utils/mailer';
import { Error } from 'mongoose';
import { FRONT_END_URLS } from 'utils/urls';
import { mentionedInCommentTemplate } from 'utils/mailTemplates';

export const create = catchErrors(async (req, res) => {
  const { userName, mentionedUsers, ...body } = req.body;
  const comment = new Comment(body);
  const { _id } = await comment.save();
  if (mentionedUsers.length !== 0) {
    for (const userId of mentionedUsers) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      const issueUrl = `${process.env.FRONTEND_JIRA_BASE_URL +
        FRONT_END_URLS.issues +
        body.issue}#${_id.toString()}`;
      console.log(issueUrl);
      const mail = mentionedInCommentTemplate(userName, body.body, issueUrl);
      sendMail(user.email, mail.subject, mail.body);
    }
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
