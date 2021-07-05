const newFormHandler = async (event) => {
    event.preventDefault();

    const content = document.querySelector('#comment-content').value.trim();
    //get post ID to use when creating new comment
    const postId = document.querySelector('#comment-content').getAttribute('post_id');


    if (content) {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, postId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      if (response.ok) {
        document.location.replace(window.location.href);
      } else {
        alert('Failed to create comment');
      }
    }
  };
  
//   const delButtonHandler = async (event) => {
//     if (event.target.hasAttribute('data-id')) {
//       const id = event.target.getAttribute('data-id');
  
//       const response = await fetch(`/api/posts/${id}`, {
//         method: 'DELETE',
//       });
  
//       if (response.ok) {
//         document.location.replace('/dashboard');
//       } else {
//         alert('Failed to delete post');
//       }
//     }
//   };
  
  document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);
  
//   document
//     .querySelector('.post-list')
//     .addEventListener('click', delButtonHandler);