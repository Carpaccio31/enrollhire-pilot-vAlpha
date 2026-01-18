'use client';

import { useMemo, useState } from 'react';
import coursesData from '../data/courses.sample.json';
import pathways from '../data/pathways.sample.json';
import bls from '../data/bls_snapshot.sample.json';

type Course = {
  id: string;
  title: string;
  category: string;
  grades: number[];
  tags: string[];
  prereqs: string[];
};

type Goal = 'college' | 'career' | 'both';

const BRAND = {
  blue: '#1F5E8C',
  orange: '#F59E0B',
  dark: '#0F172A',
  muted: '#64748B',
  bg: '#FFFBF5',
  border: '#E5E7EB',
  soft: '#F9FAFB'
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

function chipStyle(active: boolean) {
  return {
    border: `1px solid ${active ? BRAND.blue : BRAND.border}`,
    background: active ? BRAND.soft : 'white',
    color: BRAND.dark,
    borderRadius: 999,
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600 as const,
    fontSize: 14
  };
}

export default function Page() {
  const courses = coursesData as Course[];

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [grade, setGrade] = useState<number>(9);
  const [goal, setGoal] = useState<Goal>('both');
  const [interests, setInterests] = useState<string[]>([]);
  const [jobPostText, setJobPostText] = useState<string>(''); // LinkedIn paste (optional)

  // Step 2
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selected, setSelected] = useState<string[]>([]);

  // Step 3 output
  const results = useMemo(() => {
    const selectedCourses = courses.filter(c => selected.includes(c.id));

    const tags = uniq(selectedCourses.flatMap(c => c.tags));
    const skills = uniq(
      tags.flatMap(t => (pathways as any).tagToSkills?.[t] ?? [])
    );

    const majors = uniq(
      skills.flatMap(s => (pathways as any).skillToMajors?.[s] ?? [])
    );

    const industries = uniq(
      majors.flatMap(m => (pathways as any).majorToIndustries?.[m] ?? [])
    );

    // Simple “BLS-like” role suggestions from snapshot (offline)
    const roles = uniq(
      (bls as any[])
        .filter(r => goal === 'college' ? true : true)
        .filter(r => industries.length === 0 ? true : industries.includes(r.family))
        .map(r => r.title)
    ).slice(0, 8);

    // Recommended next courses (based on prereqs relationship)
    const next = courses
      .filter(c => c.prereqs?.some(p => selected.includes(p)) && !selected.includes(c.id))
      .filter(c => c.grades.includes(grade) || c.grades.includes(grade + 1))
      .slice(0, 10);

    // LinkedIn pasted job text → lightweight keyword tags (compliant)
    const jobText = jobPostText.toLowerCase();
    const jobHints: string[] = [];
    if (jobText.includes('python') || jobText.includes('sql') || jobText.includes('dashboard')) jobHints.push('Data & Analytics');
    if (jobText.includes('javascript') || jobText.includes('react') || jobText.includes('next.js')) jobHints.push('Software / Web');
    if (jobText.includes('patient') || jobText.includes('clinical')) jobHints.push('Healthcare');
    if (jobText.includes('warehouse') || jobText.includes('logistics') || jobText.includes('inventory')) jobHints.push('Supply Chain');

    return {
      selectedCourses,
      tags,
      skills,
      majors: majors.slice(0, 10),
      industries: industries.slice(0, 10),
      roles,
      nextCourses: next,
      jobHints: uniq(jobHints)
    };
  }, [courses, selected, grade, goal, jobPostText]);

  const categories = useMemo(() => {
    return ['All', ...uniq(courses.map(c => c.category)).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter(c => (category === 'All' ? true : c.category === category))
      .filter(c => c.grades.includes(grade) || c.grades.includes(grade + 1) || c.grades.includes(grade - 1))
      .filter(c => (q ? c.title.toLowerCase().includes(q) : true))
      .slice(0, 60);
  }, [courses, query, category, grade]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ border: `1px solid ${BRAND.border}`, borderRadius: 16, padding: 20, background: 'white' }}>
      {children}
    </div>
  );

  return (
    <main style={{ padding: 40, background: BRAND.bg, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', color: BRAND.dark }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <img src="/enrollhire-logo.png" alt="EnrollHire" style={{ height: 52 }} />
        <span style={{ padding: '4px 10px', borderRadius: 999, background: BRAND.orange, color: 'white', fontSize: 12, fontWeight: 700 }}>
          Pilot • Fallback-only
        </span>
      </div>

      <h1 style={{ margin: '8px 0' }}>Courses → Skills → Majors → Careers</h1>
      <p style={{ color: BRAND.muted, maxWidth: 900, marginTop: 0, lineHeight: 1.4 }}>
        EnrollHire supports exploration and conversation. It does not guarantee admission, employment, or salary.
      </p>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <button style={chipStyle(step === 1)} onClick={() => setStep(1)}>1) Student</button>
        <button style={chipStyle(step === 2)} onClick={() => setStep(2)}>2) Courses</button>
        <button style={chipStyle(step === 3)} onClick={() => setStep(3)} disabled={selected.length === 0}>3) Pathways</button>
      </div>

      <div style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
        {step === 1 && (
          <Card>
            <h2 style={{ marginTop: 0 }}>Step 1: Student profile</h2>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Grade</div>
                <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} style={{ padding: 10, borderRadius: 12, border: `1px solid ${BRAND.border}` }}>
                  {[8,9,10,11,12].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Goal</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(['college','career','both'] as Goal[]).map(g => (
                    <button key={g} style={chipStyle(goal === g)} onClick={() => setGoal(g)}>
                      {g === 'both' ? 'College + Career' : g[0].toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Interests (optional)</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Helping people','Technology','Business','Creative work','Hands-on / Trades','Science'].map(i => (
                    <button
                      key={i}
                      style={chipStyle(interests.includes(i))}
                      onClick={() => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Optional: paste a job posting (LinkedIn, Indeed, etc.)</div>
                <textarea
                  value={jobPostText}
                  onChange={(e) => setJobPostText(e.target.value)}
                  placeholder="Paste text here. We’ll only use it to highlight keywords locally (no scraping)."
                  style={{ width: '100%', minHeight: 90, padding: 10, borderRadius: 12, border: `1px solid ${BRAND.border}` }}
                />
                {results.jobHints.length > 0 && (
                  <div style={{ marginTop: 8, color: BRAND.muted, fontSize: 13 }}>
                    Detected job hints: <b>{results.jobHints.join(', ')}</b>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{ padding: '10px 14px', borderRadius: 12, border: `1px solid ${BRAND.orange}`, background: BRAND.orange, color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  Continue to Courses
                </button>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 style={{ marginTop: 0 }}>Step 2: Add courses</h2>

            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses (e.g., Algebra, Computer, Biology)…"
                  style={{ flex: 1, minWidth: 240, padding: 10, borderRadius: 12, border: `1px solid ${BRAND.border}` }}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: 10, borderRadius: 12, border: `1px solid ${BRAND.border}` }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selected.map(id => {
                  const c = courses.find(x => x.id === id);
                  if (!c) return null;
                  return (
                    <button key={id} onClick={() => toggle(id)} style={{ border: `1px solid ${BRAND.dark}`, background: BRAND.dark, color: 'white', borderRadius: 999, padding: '7px 10px', cursor: 'pointer' }}>
                      {c.title} ✕
                    </button>
                  );
                })}
                {selected.length === 0 && <span style={{ color: BRAND.muted }}>Select 4–8 courses to start…</span>}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {filteredCourses.map(c => (
                  <button key={c.id} onClick={() => toggle(c.id)} style={{ border: `1px solid ${BRAND.border}`, background: 'white', borderRadius: 999, padding: '7px 10px', cursor: 'pointer' }}>
                    + {c.title}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ padding: '10px 14px', borderRadius: 12, border: `1px solid ${BRAND.border}`, background: 'white', cursor: 'pointer' }}>
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selected.length === 0}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: `1px solid ${BRAND.orange}`,
                    background: selected.length === 0 ? BRAND.border : BRAND.orange,
                    color: selected.length === 0 ? BRAND.muted : 'white',
                    fontWeight: 800,
                    cursor: selected.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  View Pathways
                </button>
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <h2 style={{ marginTop: 0 }}>Step 3: Your pathways</h2>

            <Section title="Skills you’re building" items={results.skills} />
            {goal !== 'career' && <Section title="College majors students often explore" items={results.majors} />}
            <Section title="Industries to research" items={results.industries} />
            <Section title="In-demand roles (offline snapshot)" items={results.roles} />

            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Next courses to consider</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {results.nextCourses.length === 0 && <span style={{ color: BRAND.muted }}>No next-course suggestions yet. Add more courses or try another category.</span>}
                {results.nextCourses.map(c => (
                  <span key={c.id} style={{ border: `1px solid ${BRAND.border}`, background: BRAND.soft, borderRadius: 999, padding: '6px 10px' }}>
                    {c.title}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ padding: '10px 14px', borderRadius: 12, border: `1px solid ${BRAND.border}`, background: 'white', cursor: 'pointer' }}>
                Back to Courses
              </button>
              <button onClick={() => { setSelected([]); setQuery(''); setCategory('All'); setStep(1); }} style={{ padding: '10px 14px', borderRadius: 12, border: `1px solid ${BRAND.border}`, background: 'white', cursor: 'pointer' }}>
                Start Over
              </button>
            </div>

            <div style={{ marginTop: 16, color: BRAND.muted, fontSize: 13, lineHeight: 1.5 }}>
              • EnrollHire supports exploration and conversation. It does not guarantee outcomes. <br />
              • For best results, review options with a counselor/advisor.
            </div>
          </Card>
        )}

        <footer style={{ marginTop: 6, color: BRAND.muted, fontSize: 13, maxWidth: 900 }}>
          <strong>About EnrollHire</strong><br />
          EnrollHire is an exploration tool designed to support students and counselors. It does not recommend specific colleges,
          guarantee admission or employment, or replace academic or career advising.
        </footer>
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  const safe = items.filter(Boolean).slice(0, 12);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {safe.length === 0 ? <span style={{ color: '#64748B' }}>Add more courses to see suggestions.</span> : null}
        {safe.map((x) => (
          <span key={x} style={{ border: '1px solid #E5E7EB', borderRadius: 999, padding: '6px 10px', background: '#F9FAFB' }}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
