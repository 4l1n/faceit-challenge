import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Post } from "@/types/post";

const BODY_PREVIEW_LENGTH = 100;

interface PostCardProps {
  post: Post;
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PostCard({ post }: PostCardProps) {
  const { author, body, createdAt } = post;

  const isLong = body.length > BODY_PREVIEW_LENGTH;
  const preview = isLong
    ? body.slice(0, BODY_PREVIEW_LENGTH).trimEnd() + "…"
    : body;

  return (
    <Card className="w-full border-border bg-surface shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="size-10 shrink-0 ring-2 ring-primary-500/30">
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback className="bg-primary-500 text-white font-semibold text-sm">
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-foreground text-sm leading-tight truncate">
            {author.name}
          </span>
          <span className="text-xs text-muted">{formatRelativeDate(createdAt)}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed text-foreground/80">{preview}</p>
      </CardContent>
    </Card>
  );
}
