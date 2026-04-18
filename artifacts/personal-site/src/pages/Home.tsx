import ExperienceSection from "@/components/ExperienceSection";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Pranav Varshney</h1>
        <section className="mb-6">
          <p className="mb-2">Some things about me:</p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>
              Studying computer science at{" "}
              <a href="https://umich.edu" target="_blank" rel="noopener noreferrer">
                University of Michigan
              </a>
            </li>
            <li>
              Software Engineer Intern at{" "}
              <a href="https://databricks.com" target="_blank" rel="noopener noreferrer">
                Databricks
              </a>{" "}
              (Delta Sharing)
            </li>
            <li>
              Interested in distributed systems, ai/ml, and quantitative finance
            </li>
            <li>
              Obsessed with philosophy (
              <a href="https://en.wikipedia.org/wiki/Philosophy_of_mind" target="_blank" rel="noopener noreferrer">
                mind and machines
              </a>
              )
            </li>
          </ul>
        </section>
      </header>

      <ExperienceSection />

      <section className="mt-8 mb-6">
        <p className="mb-2">Some places to <span className="underline">find</span> me:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>
            Email:{" "}
            <a href="mailto:pvarsh@umich.edu">pvarsh [at] umich [dot] edu</a>
          </li>
          <li>
            Github:{" "}
            <a href="https://github.com/pvarshh" target="_blank" rel="noopener noreferrer">
              @pvarshh
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a href="https://linkedin.com/in/pvarshh" target="_blank" rel="noopener noreferrer">
              @pvarshh
            </a>
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-border">
        <p className="text-right text-sm text-muted-foreground italic">
          कृण्वन्तो विश्वमार्यम् | Make the world noble
        </p>
      </footer>
    </div>
  );
}
