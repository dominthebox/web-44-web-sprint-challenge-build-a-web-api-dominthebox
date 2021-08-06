// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const projects = await Project.get()
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({
            message: `Projects were not retrieved: ${err.message}`,
        })
    }
});

router.get('/:id', (req, res) => {
    Project.get(req.params.id)
    .then(project => {
        if (project) {
            res.status(200).json(project)
        } else {
            res.status(404).json({
                message: 'The project with the specified ID does not exist',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'The project with that id could not be retrieved',
        })
    })
})


module.exports = router