import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatRelativeDate } from "@/lib/utils";
import { BODY_PREVIEW_LENGTH } from "@/lib/contants";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  postPage?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, postPage = false }: PostCardProps) => {
  const { author, body, title } = post;

  // Used to check if the post body is long and needs to be truncated
  const isLong = body.length > BODY_PREVIEW_LENGTH;

  // Truncate the post body if it is long
  const preview = isLong && !postPage
    ? body.slice(0, BODY_PREVIEW_LENGTH).trimEnd() + "…"
    : body;

  const card = (
    <Card className={`w-full border-border bg-surface shadow-sm transition-shadow duration-200 ${!postPage ? "group-hover:shadow-md cursor-pointer" : ""}`}>
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
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col gap-2">
        {title && (
          <p className="font-semibold text-foreground text-sm leading-snug">{title}</p>
        )}
        <p className="text-sm leading-relaxed text-foreground/80">{preview}</p>
      </CardContent>
    </Card>
  );

  if (postPage) {
    return card;
  }

  return (
    <Link
      href={`/posts/${post.id}`}
      className="block group"
    >
      {card}
    </Link>
  );
}

export default PostCard;

