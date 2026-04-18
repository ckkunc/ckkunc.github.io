import { useLocation, useParams } from "wouter";
import Markdown from "react-markdown";
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
        <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground mb-8 block cursor-pointer border-none bg-transparent p-0 font-serif">
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
      <div className="prose prose-sm max-w-none leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:underline [&_code]:font-mono [&_code]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
        <Markdown>{post.content}</Markdown>
      </div>
    </div>
  );
}
