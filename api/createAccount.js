const mongoose = require('mongoose');
const { exit } = require('process');
require('dotenv').config()
const connectionString = process.env.MONGO_URL
const createDatabaseConnection = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        exit(1);
    }
};

createDatabaseConnection();

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            maxlength: 200,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            maxlength: 2000,
        },
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        issues: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Issue',
            },
        ],
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project',
        },
    },
    {
        timestamps: true,
    },
);

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100,
            unique: true,
        },
        url: String,
        description: String,
        category: {
            type: String,
            required: true,
        },
        issues: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Issue',
            },
        ],
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

const createUserAndProject = async () => {
    try {
        const user = await User.create({
            name: "test",
            email: "test@mail.com",
            isAdmin: true,
            password: "$2b$10$yjZoGbAHHwVZUGiX1ttkS.CCHi7RAT.nawrs343WageepB5kmhc/S",
            comments: [],
            issues: [],
            project: null,
        });

        const project = await Project.create({
            name: "Testing",
            url: "",
            category: "software",
            issues: [],
            users: [user._id],
        });
    } catch (error) {
        console.error('Error creating user or project:', error);
    } finally {
        exit();
    }
};

createUserAndProject();
