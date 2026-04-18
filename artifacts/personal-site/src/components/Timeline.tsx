import { useLocation } from "wouter";
import { posts } from "@/content";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const sorted = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function Timeline() {
  const [, navigate] = useLocation();

  if (sorted.length === 0) return null;

  return (
    <div className="pt-1">
      <h2 className="text-lg font-bold mb-6">Writing</h2>
      <div className="relative pl-5">
        <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
        <div className="space-y-7">
          {sorted.map((post) => (
            <button
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="relative flex items-start gap-3 text-left group w-full"
            >
              <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/40 transition-all duration-150 group-hover:bg-foreground group-hover:scale-125 flex-shrink-0" />
              <div className="transition-transform duration-150 origin-left group-hover:scale-[1.03]">
                <p className="text-sm font-medium leading-snug group-hover:underline underline-offset-2">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(post.date)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
