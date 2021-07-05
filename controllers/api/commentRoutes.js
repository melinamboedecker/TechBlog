const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, async (req, res) => {
  try {
    console.log('IIIIIIIIIIIIII')
    console.log(req.body)
    
  
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      //figure out how to get user_name 
      // user_name: userName,
      post_id: req.body.postId,
    });
    console.log('NEW NEW NEW ')
    console.log(newComment)   
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
}); 



module.exports = router;