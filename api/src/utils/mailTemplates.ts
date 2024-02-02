const templateHeader = (title: String) => `
    <div style="text-align:center">
    <h1>Jira Notification</h1>
    <h4>${title}</h4>
    <hr style="border: 2px solid black"/>
    </div>
  `

export const mentionedInCommentTemplate = (username: any, body: any, issueUrl: any) => ({
  subject: `Jira notification - ${username} mentioned you in a comment`,
  body: `
        ${templateHeader("Mention Alert")}
        <p>
          <p>${body}</p>
          <br/><a href='${issueUrl}'>Click here to view comment</a>
        </p>`,
});

export const issueCreatedTemplate = (authorName: any, issueDetails: any) => ({
  subject: `Jira notification - ${authorName} assigned an Issue`,
  body: `
  ${templateHeader("New Issue Assignment")}
  <p>
    <p>Title : ${issueDetails.title}</p>
    <p>Reporter : ${issueDetails.reporter}</p>
    <p>Assignee : ${issueDetails.assignee} (you)</p>
    Link: <a href='${issueDetails.url}'>Click here to view issue</a>
  </p>`,
});

export const newAccountTemplate = (username: any, siteUrl: any) => ({
  subject: 'Welcome to Jira - Your Account Has Been Successfully Created',
  body: `
  ${templateHeader("Welcome Aboard")}
  <p>Hello ${username},</p>
  <p>Your Jira account is now active!</p>
  <p>Explore Jira's features and feel free to reach out if you need assistance.</p>
  <br>
  <a href='${siteUrl}'>You can login here</a>
  <p>Regards,</p>
  <p>Admin</p>
  `,
});

export const resetPasswordTemplate = (username: any, urlLink:any, ) => ({
  subject: 'Resetting your Jira account password',
  body: `
  ${templateHeader("Reset Password")}
  <div style="margin: 10px auto">
  <strong>Hi ${username},</strong>
  <p>Forgot your password?</p>
  <p>We received a request to reset the password for your account. To reset the password, click the button below to proceed.</p>
  <button style="background: #5E5DF0; border-radius: 10px; box-shadow: #5E5DF0 0 10px 20px -10px; color: white; cursor: pointer; font-size: 16px; font-weight: 700; outline: 0 solid transparent; padding: 6px 12px; border: 0; transition: transform 0.3s ease-in-out;">
    <a href="${urlLink}" style="text-decoration: none; color: white; display: block; width: 100%; height: 100%;">Reset Password</a>
  </button>
  <p>Or click the text below, copy and paste the URL into your browser:</p>
  <p><em style="user-select: all; -webkit-user-select: all; cursor: text;">${urlLink}</em></p>
  <span style="color: gray; text-decoration: underline;">If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 5 minutes.</span>
  </div>
    `,
})
