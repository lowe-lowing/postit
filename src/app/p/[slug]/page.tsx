import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params: { slug } }: PageProps) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findUnique({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!subreddit) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">p/{subreddit.name}</h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default page;
