import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_POSTS } from "@/lib/mocks";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) notFound();

  const { author, body, createdAt } = post;

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          ← Back to feed
        </Link>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="size-12 shrink-0 ring-2 ring-primary-500/30">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback className="bg-primary-500 text-white font-semibold">
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{author.name}</p>
            <p className="text-xs text-muted">{formatDate(createdAt)}</p>
          </div>
        </div>

        {/* Full body */}
        <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {body}
        </p>
      </div>
    </main>
  );
}
