import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

export const DishUpvoteDownvote = ({
  size,
  name,
}: {
  size: 'sm' | 'md'
  name: string
}) => {
  return <UpvoteDownvoteScore score={100} vote={0} setVote={() => {}} />
}
