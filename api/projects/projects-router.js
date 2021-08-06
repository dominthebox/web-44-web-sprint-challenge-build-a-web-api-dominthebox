// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const projects = await Project.get(req.params.id)
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
});

router.post('/', (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        res.status(400).json({
            message: 'Please provide a name and description for the project'
        })
    } else {
        Project.insert({ name, description })
            .then(({ id }) => {
                return Project.get(id)
            })
            .then(project => {
                res.status(201).json(project)
            })
            .catch( err => {
                res.status(500).json({
                    message: 'There was an error adding the project to the database',
                    err: err.message,
                })
            })
    }
});

router.put('/:id', (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        res.status(400).json({
            message: 'Please provide updates to name and description for the project'
        })
    } else {
        Project.get(req.params.id)
            .then(project => {
                if (!project) {
                    res.status(404).json({
                        message: 'The project with specified ID does not exist'
                    })
                } else {
                    return Project.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Project.get(req.params.id)
                }
            })
            .then(project => {
                if (project) {
                    res.json(project)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The project information could not be retrieved',
                    err: err.message,
                    stack: err.stack
                })
            })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist',
            })
        } else {
            await Project.remove(req.params.id)
            res.json(project)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The project could not be removed',
            err: err.message
        })
    }
});

router.get('/:id/actions', async (req, res) => {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist'
            })
        } else {
            const actions = await Project.getProjectActions(req.params.id)
            res.json(actions)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The actions could not be retrieved',
            err: err.message
        })
    }
});


module.exports = router