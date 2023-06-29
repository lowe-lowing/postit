import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";
import { getAuthSession } from "@/lib/auth";

interface PostVoteServerProps {
  postId: string;
  initialVotestAmount: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}
const PostVoteServer = async ({
  postId,
  initialVotestAmount,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesAmount: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmount = initialVotestAmount!;
    _currentVote = initialVote!;
  }
  return (
    <PostVoteClient
      postId={postId}
      initialVotestAmount={_votesAmount}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
