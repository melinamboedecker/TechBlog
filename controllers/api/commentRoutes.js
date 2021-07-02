const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        console.log('you are HERE')
      // Get all comments and JOIN with user data
      const commentData = await Comment.findAll({
        include: [
          {
            model: Post,
            attributes: ['user_id'],
          },
        ],
      });
      
  
      // Serialize data so the template can read it
      const comments = commentData.map((comment) => comment.get({ plain: true }));
      console.log('COMMENTS ')
      console.log(comments)
  
  
      // Pass serialized data and session flag into template
      res.render('post', { 
        comments, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
//   router.get('/posts/:id', async (req, res) => {
//     try {
//       const postData = await Post.findByPk(req.params.id, {
//         include: [
//           {
//             model: User,
//             attributes: ['name'],
//           },
//           // {
//           //     model: Comment,
//           //     attributes: ['text']
//           // },
//         ],
//       });
  
//       const post = postData.get({ plain: true });
//       console.log("OOOOOOOOOOO")
//       console.log(post)
  
//       // const commentData = await Comment.findByFk(req.params.post_id, {
//       //     include: [
//       //         {
//       //             model: User,
//       //             attributes: ['name'],
//       //         },
//       //     ],
//       // });
  
//       // const comment = commentData.get({ plain: true });
  
//       res.render('post', {
//           ...post,
//           logged_in: req.session.logged_in
//         });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });


module.exports = router;