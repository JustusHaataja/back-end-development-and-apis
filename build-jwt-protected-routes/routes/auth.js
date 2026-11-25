import express from "express"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"
import { findByEmail, readUsers, writeUsers } from "../utils/db.js"
import { signToken } from "../utils/jwt.js"
import authenticate from "../middleware/authenticate.js"
import { blacklistToken } from "../utils/token-blacklist.js"

const router = express.Router()

router.get("/profile", authenticate, (req, res) => {
    res.json({ user: req.user })
})

router.post("/logout", authenticate, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    blacklistToken(token)
    res.json({ message: "Logged out successfully" })
})

router.post("/register", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        res.status(400).send({ message: "Email and password are required"})
    }
    if (findByEmail(email)) {
        res.status(409).send({ message: "Email already in use"})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = {
        id: randomUUID(),
        email,
        passwordHash,
        role: "user",
    }

    const users = readUsers()
    users.push(user)
    writeUsers(users)

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    res.status(201).json({ 
        message: "User registered succesfully",
        token,
    })
})

router.post("/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required"})
    }

    const user = findByEmail(email)

    if (!user) {
        return res.status(401).send({ message: "Invalid credentials"})
    }

    const match = await bcrypt.compare(password, user.passwordHash)

    if (!match) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    } else {
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        })
        res.status(200).json({
            message: "OK",
            token,
        })
    }
})

export default router