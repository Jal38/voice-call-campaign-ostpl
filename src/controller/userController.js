import { verifyToken, generateToken } from '../validator/authService.js'
// import bcrypt from 'bcrypt'

import user from '../models/userModel.js'
async function createUser (req, res) {
  const token = req.headers.authorization
  const {
    username,
    mobileNumber,
    email,
    password,
    state,
    city,
    role,
    cutting_percentage
  } = req.body
  try {
    if (token) {
      const { UserRole } = await verifyToken(token)
      console.log('Role', UserRole)

      if (UserRole === 'user') {
        return console.error(
          'You Dont have permission Please contact the Reseller'
        )
      }
    }

    // const hashedPassword = await bcrypt.hash(password, 10)

    const savedUser = new user({
      username,
      mobileNumber,
      email,
      password,
      state,
      city,
      role,
      cutting_percentage
    })
    console.log('usercreated@@@@@')
    const newUser = await savedUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'User creation failed', error: error.message })
  }
}

async function loginUser (req, res) {
  console.log('@@@@@@@@@@@@@')
  const { username, password } = req.body
  try {
    const User = await user.findOne({
      username: username,
      password: password
    })
    console.log(User)
    if (!User) {
      throw new Error('User not found')
    }
    // const passwordMatch = await bcrypt.compare(password, User.password)
    // if (!passwordMatch) {
    //   throw new Error('Invalid password')
    // }
    return res.send({ token: generateToken(User) })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

async function GetUserList (req, res) {
  try {
    const arrlist = []
    const usersList = await user.find({})
    return res.json(usersList)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export { createUser, loginUser, GetUserList }
