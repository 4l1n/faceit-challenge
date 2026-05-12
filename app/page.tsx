import PostFeedContainer from "@/components/Post/PostFeedContainer";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Feed
          </h1>
          <p className="mt-1 text-sm text-text">
            Latest posts from the community
          </p>
        </div>

        {/* Feed — data comes from Redux via PostFeedContainer */}
        <PostFeedContainer />
      </div>
    </main>
  );
}

export default Home;
