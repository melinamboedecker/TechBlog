const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
      console.log('you are HERE')
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log('POSTS POSTS POSTS ')
    console.log(posts)


    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// router.get('/posts/try', async (req, res) => {
//   try {
//     console.log('kjhkjhlkjhkjh')
//     const postData = await Comment.findAll( {
//         include: [
//           // {
//           //     model: Post,
//           //     attributes: ['title'],
//           // }
//         ]
//     });

//     console.log("***************")
//     console.log(postData)

//     const post = postData.get({ plain: true });
//     console.log('post ******************* post')
//     console.log(post)
//     res.render('post', {
//             ...post,
//             logged_in: req.session.logged_in
//           }); 
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//when individual post is selected
router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    // const currentUser = await User.findById(req.params.id)
    const postData = await Post.findByPk(req.params.id, {
            include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
            model: Comment,
            attributes: ['content', 'user_id', 'date_created'],
            include: {
              model: User,
              attributes: ['name']
            }
        },
      ],
    });

    // const userData = await User.findByPk(req.params.id, {
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name'],
    //     },
    //     {
    //       model: Comment,
    //       attributes: ['content', 'user_id', 'date_created'],
    //   },
    //   ],
    // })

    console.log(postData);
    const post = postData.get({ plain: true });
    console.log("WWWWWWWWWWWWWWW")
    console.log(post)
    console.log('post user id below')
    console.log(post.user_id)
    console.log('current user id below')
    console.log(req.session.user_id)

    const postUserId = post.user_id
    const currentUserId = req.session.user_id
    var isUsersPost;

    function usersPost (postUser, currentUser) {
      if (postUser === currentUser) {
        isUsersPost = true;
      } else {
        isUsersPost = false
      }
    }
    usersPost(post.user_id, req.session.user_id)

    console.log('current users post?')
    console.log(isUsersPost)

    // console.log(userData)
    // const user = userData.get({ plain: true });

    res.render('post', {
      ...post,
      // user,
      logged_in: req.session.logged_in,
      current_user: req.session.user_id,
      current_users_post: isUsersPost
    }); 
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/posts/:id', async (req, res) => {
//   try {
//     const postData = await Post.findByPk(req.params.id, {
//       include: [
//         {
//           model: Comment,
//           required: false,
//           attributes: ['content'],
//           include: [
//             {
//               model: User,
//               required: false,
//               attributes: ['name']
//             }
//           ]
//       }]
//     });

//     console.log(postData);
//     const post = postData.get({ plain: true });
//     console.log("OOOOOOOOOOO")
//     console.log(post)

//     // const commentData = await Comment.findByFk(req.params.post_id, {
//     //     include: [
//     //         {
//     //             model: User,
//     //             attributes: ['name'],
//     //         },
//     //     ],
//     // });

//     // const comment = commentData.get({ plain: true });

//     res.render('post', {
//         ...post,
//         logged_in: req.session.logged_in
//       });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/comments/:id', async (req, res) => {
//     try {
//       const commentData = await Comment.findByPk(req.params.id, {
//         include: [
//           {
//             model: User,
//             attributes: ['name'],
//           },
//           {
//               model: Comment,
//               attributes: ['content']
//           },
//         ],
//       });
  
//       const comment = commentData.get({ plain: true });
//       console.log("CCCCCCCCC")
//       console.log(comment)
  
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

// Use withAuth middleware to prevent access to route 
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
