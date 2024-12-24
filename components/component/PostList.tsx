import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFetcher";
import Post from "./Post";

export default async function PostList({ username }: { username?: string }) {
  const { userId } = auth();
  if (!userId) {
    return;
  }

  const posts = await fetchPosts(userId, username);

  return (
    <div className="space-y-4">
      {posts ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        // If no posts are found, display a message
        <p className="text-muted-foreground text-center">
          No posts found. Start following people to see posts.
        </p>
      )}
    </div>
  );
}
