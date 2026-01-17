export default function Home() {
  return (
    <main>
      <h1>EnrollHire Pilot v1</h1>
      <p className="small">If you can see this page, your Vercel deployment is working.</p>

      <div className="card">
        <h2>Next steps</h2>
        <ol>
          <li>Upload this repo to GitHub (make sure <code>package.json</code> is at the top level)</li>
          <li>Import the repo into Vercel</li>
          <li>(Optional) Add <code>OPENAI_API_KEY</code> as an Environment Variable in Vercel</li>
          <li>Redeploy</li>
          <li>Then we’ll drop in the full EnrollHire AI pilot app</li>
        </ol>
      </div>
    </main>
  );
}
