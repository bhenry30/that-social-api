// getAllThoughts, getThoughtById, createThought updateThought, deleteThought, addReaction, deleteReaction

const { Thought, User } = require('../models')

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res){
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
          })
        .select('-__v')
        .then(dbThoughtData => {
            // If no thought is found, send 404
            if (!dbThoughtData) {
                res.status(400).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);

        });
    },

    // create thought
    createThought({ body }, res) {
    
        Thought.create({ 
            thoughtText: body.thoughtText,
            username: body.username,
            userId: body.userId
         })
        .then ((dbThoughtData) => {
            return User.findOneAndUpdate(
                { _id: body.userId},
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
                )
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err));
    },

    // update thought
    updateThought({ params, body }, res) {
        Thought.findOneandUpdate({ _id: params.id },
        body, { new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message : 'No thought found with this id!'});
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // remove thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params._id },
              { $pull: { thoughts: params._id} },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },
    
    // add reaction
    addReaction({ params, body }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },
    
    // remove reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
    },

}

module.exports = thoughtController