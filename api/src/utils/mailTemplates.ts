export const mentionedInCommentTemplate = (username: any, body: any, issueUrl: any) => ({
  subject: `Jira notification - ${username} mentioned you in a comment`,
  body: `<p>
          <p>${body}</p>
          <br/><a href='${issueUrl}'>Click here to view comment</a>
        </p>`,
});

export const issueCreatedTemplate = (authorName: any, issueDetails: any) => ({
  subject: `Jira notification - ${authorName} assigned an Issue`,
  body: `<p>
    <p>Title : ${issueDetails.title}</p>
    <p>Reporter : ${issueDetails.reporter}</p>
    <p>Assignee : ${issueDetails.assignee} (you)</p>
    Link: <a href='${issueDetails.url}'>Click here to view issue</a>
  </p>`,
});

export const newAccountTemplate = (username: any, siteUrl: any) => ({
  subject: 'Welcome to Jira - Your Account Has Been Successfully Created',
  body: `
  <p>Hello ${username},</p>
  <p>Your Jira account is now active!</p>
  <p>Explore Jira's features and feel free to reach out if you need assistance.</p>
  <br>
  <a href='${siteUrl}'>You can login here</a>
  <p>Regards,</p>
  <p>Admin</p>
  `,
});
