// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const projects = await Project.get()
        console.log(projects)
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({
            message: `Projects were not retrieved: ${err.message}`,
        })
    }
})



module.exports = router