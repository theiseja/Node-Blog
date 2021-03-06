const express = require("express");

const userDb = require("../data/helpers/userDb");
const router = express.Router();

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  userDb
    .get(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "user does not exist" });
      }
    })
    .catch(err => {
      res
        .status(404)
        .json({ error: "The user information could not be retrieved." });
    });
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params
  userDb
    .getUserPosts(id)
    .then(posts => {
      if(posts) {
      res.json(posts)
      } else {
        res.status(404).json({message: 'This user does not exist or has not posted'})
      }
    })
    .catch(err => {
      res
        .status(404)
        .json({ error: 'The user info could not be retrieved'})
    })
})

router.post("/", (req, res) => {
  const user = req.body;
  if (user.name) {
    userDb
      .insert(user)
      .then(idInfo => {
        userDb.get(idInfo.id).then(user => {
          res.status(201).json(user);
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving user to the database"
        });
      });
  } else {
    res.status(400).json({ errorMessage: "Please provide name for user" });
  }
});

router.put('/:id', (req, res) => {
  const user = req.body
  const { id } = req.params
  if (user.name) {
    userDb.update(id, user)
      .then(count => {
        if (count) {
          userDb.get(id).then(user => {
            res.json(user)
          })
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist"})
        }
      })
      .catch(err => {
        res.status(500)
        .json({ error: 'The user information could not be modifed.'})
  })
} else {
  res.status(400)
  .json({ errorMessage: 'Please provide name for the user'})
}
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  userDb.remove(id)
    .then(count => {
      if (count) {
        res.json({ message: 'User successfully deleted'})
      } else {
        res 
          .status(404)
          .json({ message: 'The user with the specified ID does not exist'})
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be removed'})
    })
})



module.exports = router;