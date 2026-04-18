import { useLocation, useParams } from "wouter";
import { posts } from "@/content";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="max-w-2xl px-8 py-10">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground mb-8 block no-underline"
        >
          ← back
        </button>
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl px-8 py-10">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-muted-foreground hover:text-foreground mb-8 block cursor-pointer border-none bg-transparent p-0 font-serif"
      >
        ← back
      </button>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">{formatDate(post.date)}</p>
      <div
        className="prose prose-sm max-w-none leading-relaxed space-y-4 [&_p]:mb-4 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
