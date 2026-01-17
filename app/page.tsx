'use client';

import { useMemo, useState } from 'react';

type Result = {
  mode: 'fallback' | 'ai';
  skills: string[];
  majors: string[];
  industries: string[];
  roles: string[];
  notes: string[];
};

const COURSE_LIBRARY = [
  'English 9', 'English 10', 'English 11', 'English 12',
  'Algebra I', 'Geometry', 'Algebra II', 'Precalculus', 'Calculus', 'AP Calculus',
  'Biology', 'Chemistry', 'Physics', 'Environmental Science', 'AP Biology',
  'World History', 'US History', 'Government', 'Economics', 'Psychology',
  'Intro to Computer Science', 'AP Computer Science', 'Web Design',
  'Spanish I', 'Spanish II', 'French I',
  'Art', 'Music', 'Theater',
  'Health', 'PE',
  'Business', 'Marketing', 'Accounting',
  'Engineering', 'Robotics',
];

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

// Simple fallback mapping so the pilot works even without an API key
function fallbackEngine(courses: string[]): Result {
  const skills: string[] = [];
  const majors: string[] = [];
  const industries: string[] = [];
  const roles: string[] = [];
  const notes: string[] = [];

  const has = (s: string) => courses.includes(s);

  // Skills
  if (courses.some(c => c.includes('English'))) skills.push('Communication', 'Writing');
  if (['Algebra I','Geometry','Algebra II','Precalculus','Calculus','AP Calculus'].some(has))
    skills.push('Quantitative Reasoning', 'Problem Solving');
  if (['Biology','Chemistry','Physics','Environmental Science','AP Biology'].some(has))
    skills.push('Scientific Thinking', 'Data Literacy');
  if (['Intro to Computer Science','AP Computer Science','Web Design','Robotics'].some(has))
    skills.push('Computational Thinking', 'Logic', 'Systems Thinking');
  if (['World History','US History','Government','Economics','Psychology'].some(has))
    skills.push('Critical Thinking', 'Civic Literacy');

  // Majors (broad + alternatives)
  if (skills.includes('Computational Thinking')) majors.push('Computer Science', 'Information Systems', 'Data Science');
  if (skills.includes('Scientific Thinking')) majors.push('Biology', 'Public Health', 'Environmental Science');
  if (skills.includes('Quantitative Reasoning')) majors.push('Business Analytics', 'Economics', 'Engineering');
  if (skills.includes('Writing')) majors.push('Communications', 'Education', 'Journalism');
  if (skills.includes('Civic Literacy')) majors.push('Political Science', 'Sociology', 'Public Policy');

  // Industries
  if (majors.includes('Computer Science') || majors.includes('Data Science')) industries.push('Technology', 'Healthcare (tech-enabled)', 'Financial Services');
  if (majors.includes('Public Health') || majors.includes('Biology')) industries.push('Healthcare', 'Biotech', 'Public Sector');
  if (majors.includes('Business Analytics') || majors.includes('Economics')) industries.push('Business', 'Finance', 'Consulting');
  if (majors.includes('Education') || majors.includes('Communications')) industries.push('Education', 'Media', 'Nonprofit');

  // Roles (role families)
  if (industries.includes('Technology')) roles.push('Software/IT', 'Data & Analytics', 'Cybersecurity');
  if (industries.includes('Healthcare')) roles.push('Clinical Support', 'Health Admin', 'Public Health');
  if (industries.includes('Finance')) roles.push('Analyst', 'Operations', 'Client Services');
  if (industries.includes('Education')) roles.push('Teaching', 'Student Support', 'Program Coordination');

  notes.push(
    'EnrollHire is guidance, not a guarantee of admission, employment, or salary.',
    'These are starting points. Multiple pathways can fit the same skills.',
    'Talk with a counselor/advisor to refine choices based on your interests and context.'
  );

  return {
    mode: 'fallback',
    skills: uniq(skills).slice(0, 8),
    majors: uniq(majors).slice(0, 6),
    industries: uniq(industries).slice(0, 6),
    roles: uniq(roles).slice(0, 6),
    notes
  };
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [interest, setInterest] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const remaining = useMemo(
    () => COURSE_LIBRARY.filter(c => !selected.includes(c)),
    [selected]
  );

  const toggleCourse = (course: string) => {
    setSelected(prev => prev.includes(course) ? prev.filter(x => x !== course) : [...prev, course]);
  };

  const generate = async () => {
    setLoading(true);
    setResult(null);

    // If you later add /api/generate, you can switch this to call it.
    // For now this works as a pilot demo without any API key.
    const r = fallbackEngine(selected);
    if (interest.trim()) {
      r.notes.unshift(`Interests noted: ${interest.trim()}`);
    }
    setResult(r);
    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
  <img
    src="/enrollhire-logo.png"
    alt="EnrollHire logo"
    style={{ height: 56 }}
  </h1>
</div>
<p style={{ color: '#64748B', maxWidth: 720 }}>
  EnrollHire helps students explore college majors and career options based on their courses.
  This tool supports exploration and conversation — it does not make decisions or guarantees outcomes.
</p>
</h1>
      <div style={{ color: '#6b7280', marginBottom: 18 }}>
        Grades 8–12 • Course-to-Major-to-Career Pathways • <b>{result?.mode ?? 'ready'}</b>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', maxWidth: 860 }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>1) Select your courses</h2>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {selected.map(c => (
              <button
                key={c}
                onClick={() => toggleCourse(c)}
                style={{ border: '1px solid #111827', borderRadius: 999, padding: '6px 10px', background: '#111827', color: 'white' }}
              >
                {c} ✕
              </button>
            ))}
            {selected.length === 0 && <span style={{ color: '#6b7280' }}>Choose a few courses below…</span>}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {remaining.map(c => (
              <button
                key={c}
                onClick={() => toggleCourse(c)}
                style={{ border: '1px solid #e5e7eb', borderRadius: 999, padding: '6px 10px', background: 'white' }}
              >
                + {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>2) Interests (optional)</h2>
          <input
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Examples: helping people, technology, business, creative work…"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #e5e7eb' }}
          />
          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button
              disabled={selected.length === 0 || loading}
              onClick={generate}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #111827',
                background: selected.length === 0 ? '#e5e7eb' : '#111827',
                color: selected.length === 0 ? '#6b7280' : 'white',
                cursor: selected.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Generating…' : 'Generate Pathways'}
            </button>
            <button
              onClick={() => { setSelected([]); setInterest(''); setResult(null); }}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white' }}
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Your pathways</h2>

            <Section title="Skills being developed" items={result.skills} />
            <Section title="Majors commonly aligned (plus alternatives)" items={result.majors} />
            <Section title="Industries to explore" items={result.industries} />
            <Section title="Role families" items={result.roles} />

            <div style={{ marginTop: 14, color: '#6b7280', fontSize: 13, lineHeight: 1.4 }}>
              {result.notes.map((n, i) => <div key={i}>• {n}</div>)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {items.map((x) => (
          <span key={x} style={{ border: '1px solid #e5e7eb', borderRadius: 999, padding: '6px 10px', background: '#f9fafb' }}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
