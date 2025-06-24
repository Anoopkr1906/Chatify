import React from 'react'

const Title = ({title="Chat" , description="This is the chat App called Chatify"}) => {
  return (
    <div>
      <title>{title}</title>
      <meta name='description' content={description} />
    </div>
  )
}

export default Title
