import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'



// login User
const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        })
    }
    else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
})


// register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }
    else {
        res.status(400);
        throw new Error('Error Invalid data');
    }
})


// lougout User
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ Message: "user logged out" })
})


// get profile User
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
})


// update User
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save();
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        })

    } else {
        res.status(404)
        throw new Error('User not Found')
    }

})



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}
