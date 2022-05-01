const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller')

router
    .route('/:userId')
    .get(getAllThoughts)
    .post(createThought);

router
    .route('/:userid/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .post(addReaction)
    .delete(deleteThought);

router
    .route('/:userid/:thoughtId/:reactionId')
    .delete(deleteReaction)

module.exports = router;