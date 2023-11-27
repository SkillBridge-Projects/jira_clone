/* eslint-disable no-underscore-dangle */
import { BadUserInputError, CustomError, catchErrors } from 'errors';
import { Project, User, Comment } from 'mongooseEntities';
import { signToken } from 'utils/authToken';
import bcrypt from 'bcrypt';

const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const checkPassword = async (password: string, hash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

export const getAllUsers = catchErrors(async (req, res) => {
  let users = await User.find({}, '-password').populate('project');
  if (req.query.projectId) {
    users = users.filter(user => user.project === req.query.projectId);
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
  const projectName = body.project;
  if (!projectName) {
    throw new BadUserInputError({ project: 'Project not provided' });
  }
  const project = await Project.findOne({ name: projectName });
  if (!project) {
    throw new BadUserInputError({ project: 'project not found' });
  }
  body.project = project._id;
  const user = new User(body);
  await user.save();
  if (project) {
    project.users.push(user._id);
    await project.save();
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

// Updated code

export const editUser = catchErrors(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!userId) {
    throw new CustomError('User ID not provided');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new BadUserInputError({ userId: 'User not found' });
  }

  // Update fields that are allowed to be edited
  if (updates.name) user.name = updates.name;
  if (updates.isAdmin) user.isAdmin = updates.isAdmin;
  // Update project if provided
  if (updates.project) {
    const project = await Project.findOne({ _id: updates.project });
    if (!project) {
      throw new BadUserInputError({ project: 'Project not found' });
    }
    user.project = project._id;
  }

  await user.save();
  res.respond({ user });
});
