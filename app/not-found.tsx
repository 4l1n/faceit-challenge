import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        {/* Big 404 */}
        <span className="text-[8rem] font-extrabold leading-none text-primary-500 select-none">
          404
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm text-muted leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mt-2"
        >
          ← Back to feed
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
