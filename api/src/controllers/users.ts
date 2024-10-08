/* eslint-disable no-underscore-dangle */
import { BadUserInputError, CustomError, catchErrors } from 'errors';
import { Project, User, Comment, IProject } from 'mongooseEntities';
import { signToken } from 'utils/authToken';
import { sendMail } from 'utils/mailer';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { newAccountTemplate } from 'utils/mailTemplates';

const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const checkPassword = async (password: string, hash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

async function updateUserInProjects(
  projects: IProject[],
  userId: mongoose.Types.ObjectId,
): Promise<void> {
  for (const project of projects) {
    if (!project.users.includes(userId)) {
      project.users.push(userId);
    }
    await project.save();
  }
}

async function deleteUserInProjects(
  projects: IProject[],
  userId: mongoose.Types.ObjectId,
): Promise<void> {
  for (const project of projects) {
    if (project.users.includes(userId)) {
      const userIndex = project.users.findIndex(user => user === userId);
      project.users.splice(userIndex, 1);
    }
    await project.save();
  }
}

export const getAllUsers = catchErrors(async (req, res) => {
  let users = await User.find({}, '-password').populate('projects');
  if (req.query.projectId) {
    users = users.filter(user => user.projects.includes(req.query.projectId));
  }
  res.respond(users);
});

export const deleteUser = catchErrors(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new CustomError('Please Provide User Id');
  }
  const success = await User.deleteOne({ _id: userId });
  if (success.acknowledged && success.deletedCount === 1) {
    await Comment.deleteMany({ user: userId });
    res.respond(success);
  }
  throw new CustomError('Something Went Wrong');
});

export const create = catchErrors(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadUserInputError({ email: 'Email not provided' });
  }
  const password = await hashPassword(req.body.password, 10);
  const body = {
    ...req.body,
    password,
  };
  const projectNames = body.projects;
  if (!projectNames) {
    throw new BadUserInputError({ project: 'Project not provided' });
  }

  const projects = await Project.find({ name: { $in: projectNames } });
  const foundProjectNames = projects.map(project => project.name);

  // Check if all requested projects are found
  const missingProjects = projectNames.filter((name: string) => !foundProjectNames.includes(name));

  if (missingProjects.length > 0) {
    // Throw an error for missing projects
    throw new CustomError(
      `The following projects are not available: ${missingProjects.join(', ')}`,
    );
  }
  body.projects = projects.map(project => project._id);
  const user = new User(body);
  await user.save();
  const mail = newAccountTemplate(user.name, process.env.FRONTEND_JIRA_BASE_URL);
  sendMail(email, mail.subject, mail.body);
  if (projects) {
    await updateUserInProjects(projects, user._id);
  }
  res.respond({ user });
});

export const login = catchErrors(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadUserInputError({ email: 'Email not provided' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadUserInputError({ email: 'email not found' });
  }
  const match = await checkPassword(req.body.password, user.password);
  if (!match) {
    throw new CustomError('incorrect credentials', 403, 403);
  }
  res.respond({ authToken: signToken({ sub: user._id }) });
});

export const getCurrentUser = catchErrors((req, res) => {
  res.respond({ currentUser: req.currentUser });
});

export const editUser = catchErrors(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new CustomError('Please Provide User Id');
  }
  const user = await User.findById(userId, '-password');
  if (!user) {
    throw new CustomError('User not found');
  }

  Object.keys(req.body).forEach(key => {
    (user as any)[key] = req.body[key];
  });

  const body = {
    ...req.body,
  };

  const projectNames = body.projects;
  if (!projectNames) {
    throw new BadUserInputError({ project: 'Project not provided' });
  }
  const projects = await Project.find({ name: { $in: projectNames } });
  const foundProjectNames = projects.map(project => project.name);

  // Check if all requested projects are found
  const missingProjects = projectNames.filter((name: string) => !foundProjectNames.includes(name));

  if (missingProjects.length > 0) {
    // Throw an error for missing projects
    throw new CustomError(
      `The following projects are not available: ${missingProjects.join(', ')}`,
    );
  }

  user.projects = projects.map(project => project._id);

  updateUserInProjects(projects, user._id);

  const userInProjects = (await Project.find({ users: userId })).filter(
    proj => !user.projects.includes(proj._id),
  );

  deleteUserInProjects(userInProjects, user._id);

  await user.save();
  res.send({
    user,
  });
});
