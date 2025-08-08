// define the schema for users collection //user


/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enrolledCourses: [{
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Listing'
        },
        progress: Number
    }]
});

module.exports = mongoose.model('User', userSchema);

*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor'],
        required: true
    },
    bio: String,
    avatar: String,
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing'
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    }],
    submittedAssignments: [{
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment'
        },
        submission: String,
        score: Number,
        gradedAt: Date,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }],
    testScores: [{
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test'
        },
        answers: [{
            question: String, // Store the question text or ID
            selectedAnswer: String // Store the student's selected option
          }],
        score: Number,
        gradedAt: Date,
        submittedAt: {
            type: Date,
            default: Date.now
          }
    }]
});

// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

userSchema.methods.comparePassword = async function(candidatePassword) {
    return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);