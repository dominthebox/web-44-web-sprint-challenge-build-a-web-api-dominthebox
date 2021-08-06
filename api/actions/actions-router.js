// Write your "actions" router here!
const express = require('express');
const Action = require('./actions-model');

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const actions = await Action.get(req.params.id)
        res.status(200).json(actions)
    } catch (err) {
        res.status(500).json({
            message: `Actions were not retrieved: ${err.message}`,
        })
    }
});

router.get('/:id', (req, res) => {
    Action.get(req.params.id)
    .then(action => {
        if (action) {
            res.status(200).json(action)
        } else {
            res.status(404).json({
                message: 'The action with the specified ID does not exist',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'The Action with specified ID could not be retrieved',
        })
    })
});

router.post('/', (req, res) => {
    const { notes, description, project_id } = req.body
    if (!notes || !description || !project_id) {
        res.status(400).json({
            message: 'Please provide notes, description, and project_id for the action'
        })
    } else {
        Action.insert({ notes, description, project_id })
            .then(({ id }) => {
                return Action.get(id)
            })
            .then(action => {
                res.status(201).json(action)
            })
            .catch( err => {
                res.status(500).json({
                    message: 'There was an error adding the Action to the database',
                    err: err.message,
                })
            })
    }
});

router.put('/:id', (req, res) => {
    const { notes, description, project_id, completed } = req.body
    if (!notes || !description || !project_id || !completed) {
        res.status(400).json({
            message: 'Please provide updates to notes, description, completed, and project_id for the Action'
        })
    } else {
        Action.get(req.params.id)
            .then(action => {
                if (!action) {
                    res.status(404).json({
                        message: 'The Action with specified ID does not exist'
                    })
                } else {
                    return Action.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Action.get(req.params.id)
                }
            })
            .then(action => {
                if (action) {
                    res.json(action)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The Action information could not be retrieved',
                    err: err.message,
                    stack: err.stack
                })
            })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const action = await Action.get(req.params.id)
        if (!action) {
            res.status(404).json({
                message: 'The Action with the specified ID does not exist',
            })
        } else {
            await Action.remove(req.params.id)
            res.json(action)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The Action could not be removed',
            err: err.message
        })
    }
});

module.exports = router