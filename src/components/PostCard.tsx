import { FC } from 'react'
import { IPost } from '../types/i-post'

interface PostCardProp {
  post: IPost;
}

export const PostCard: FC<PostCardProp> = ({post}) => {
  return (
    <div className='card'>
    <div className='card-body'>
      <h5 className='card-title'>{post.title}</h5>
      <p className='card-text'>{post.body}</p>
    </div>
  </div>
  )
}