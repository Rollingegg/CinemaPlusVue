export default [
  {
    url: '/api/user/logout',
    type: 'post',
    response: _ => {
      return {
        success: true,
        message: '',
        content: ''
      }
    }
  }
]
