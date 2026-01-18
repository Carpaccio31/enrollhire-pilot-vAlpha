'use client';

import { useMemo, useState } from 'react';

type Result = {
  mode: 'fallback';
  skills: string[];
  majors: string[];
  industries: string[];
  roles: string[];
  notes: string[];
};

const BRAND = {
  blue: '#1F5E8C',
  orange: '#F59E0B',
  dark: '#0F172A',
  muted: '#64748B',
  bg: '#FFFBF5',
  border: '#E5E7EB',
  soft: '#F9FAFB',
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

function fallbackEngine(courses: string[], interest?: string): Result {
  const skills: string[] = [];
  const majors: string[] = [];
  const industries: string[] = [];
  const roles: string[] = [];
  const notes: string[] = [];

  const has = (s: string) => courses.includes(s);

  if (courses.some(c => c.includes('English'))) skills.push('Communication', 'Writing');
  if (['Algebra I','Geometry','Algebra II','Precalculus','Calculus','AP Calculus'].some(has))
    skills.push('Quantitative Reasoning', 'Problem Solving');
  if (['Biology','Chemistry','Physics','Environmental Science','AP Biology'].some(has))
    skills.push('Scientific Thinking', 'Data Literacy');
  if (['Intro to Computer Science','AP Computer Science','Web Design','Robotics'].some(has))
    skills.push('Computational Thinking', 'Logic', 'Systems Thinking');
  if (['World History','US History','Government','Economics','Psychology'].some(has))
    skills.push('Critical Thinking', 'Civic Literacy');

  if (skills.includes('Computational Thinking')) majors.push('Computer Science', 'Information Systems', 'Data Science');
  if (skills.includes('Scientific Thinking')) majors.push('Biology', 'Public Health', 'Environmental Science');
  if (skills.includes('Quantitative Reasoning')) majors.push('Business Analytics', 'Economics', 'Engineering');
  if (skills.includes('Writing')) majors.push('Communications', 'Education', 'Journalism');
  if (skills.includes('Civic Literacy')) majors.push('Political Science', 'Sociology', 'Public Policy');

  if (majors.includes('Computer Science') || majors.includes('Data Science'))
    industries.push('Technology', 'Healthcare (tech-enabled)', 'Financial Services');
  if (majors.includes('Public Health') || majors.includes('Biology'))
    industries.push('Healthcare', 'Biotech', 'Public Sector');
  if (majors.includes('Business Analytics') || majors.includes('Economics'))
    industries.push('Business', 'Finance', 'Consulting');
  if (majors.includes('Education') || majors.includes('Communications'))
    industries.push('Education', 'Media', 'Nonprofit');

  if (industries.includes('Technology')) roles.push('Software/IT', 'Data & Analytics', 'Cybersecurity');
  if (industries.includes('Healthcare')) roles.push('Clinical Support', 'Health Admin', 'Public Health');
  if (industries.includes('Finance')) roles.push('Analyst', 'Operations', 'Client Services');
  if (industries.includes('Education')) roles.push('Teaching', 'Student Support', 'Program Coordination');

  if (interest?.trim()) notes.push(`Interests noted: ${interest.trim()}`);

  notes.push(
    'EnrollHire supports exploration and conversation. It does not guarantee admission, employment, or salary.',
    'These are starting points. More than one pathway can fit the same skills.',
    'Talk with a counselor/advisor to refine options based on your goals and context.'
  );

  return {
    mode: 'fallback',
    skills: uniq(skills).slice(0, 10),
    majors: uniq(majors).slice(0, 8),
    industries: uniq(industries).slice(0, 8),
    roles: uniq(roles).slice(0, 8),
    notes,
  };
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const [interest, setInterest] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const remaining = useMemo(
    () => COURSE_LIBRARY.filter(c => !selected.includes(c)),
    [selected]
  );

  const visibleCourses = useMemo(() => {
    if (showAll) return remaining;
    // “Popular” subset first for less overwhelm
    const popular = [
      'English 10', 'English 11',
      'Algebra I', 'Geometry', 'Algebra II',
      'Biology', 'Chemistry',
      'US History', 'Government',
      'Intro to Computer Science', 'Business', 'Engineering',
      'Spanish I', 'Art'
    ];
    const popularSet = new Set(popular);
    const top = remaining.filter(c => popularSet.has(c));
    const rest = remaining.filter(c => !popularSet.has(c)).slice(0, 18);
    return [...top, ...rest];
  }, [remaining, showAll]);

  const toggleCourse = (course: string) => {
    setSelected(prev => prev.includes(course) ? prev.filter(x => x !== course) : [...prev, course]);
  };

  const explore = async () => {
    setLoading(true);
    setResult(null);
    const r = fallbackEngine(selected, interest);
    setResult(r);
    setLoading(false);
  };

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      border: `1px solid ${BRAND.border}`,
      borderRadius: 16,
      padding: 20,
      background: 'white'
    }}>
      {children}
    </div>
  );

  return (
    <main style={{
      padding: 40,
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      background: BRAND.bg,
      minHeight: '100vh',
      color: BRAND.dark
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <img src="/Enroll%20Hire.PNG" alt="EnrollHire" style={{ height: 52 }} />
        <span style={{
          padding: '4px 10px',
          borderRadius: 999,
          background: BRAND.orange,
          color: 'white',
          fontSize: 12,
          fontWeight: 600
        }}>
          Pilot • Fallback
        </span>
      </div>

      <h1 style={{ margin: '6px 0 6px 0' }}>
        Explore education and career pathways
      </h1>

      <p style={{ color: BRAND.muted, maxWidth: 820, marginTop: 0, lineHeight: 1.4 }}>
        Select courses you’ve taken (or plan to take). EnrollHire will suggest skills you’re building,
        majors students often explore, and career areas to research. This tool supports exploration and conversation —
        it does not make decisions or guarantees outcomes.
      </p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', maxWidth: 920 }}>
        {/* Step 1 */}
        <Card>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Step 1: Choose your courses</h2>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {selected.map(c => (
              <button
                key={c}
                onClick={() => toggleCourse(c)}
                style={{
                  border: `1px solid ${BRAND.dark}`,
                  borderRadius: 999,
                  padding: '7px 10px',
                  background: BRAND.dark,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {c} ✕
              </button>
            ))}
            {selected.length === 0 && (
              <span style={{ color: BRAND.muted }}>Pick a few courses below…</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button
              onClick={() => setShowAll(s => !s)}
              style={{
                border: `1px solid ${BRAND.border}`,
                borderRadius: 10,
                padding: '8px 10px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {showAll ? 'Show fewer courses' : 'Show all courses'}
            </button>
            <span style={{ color: BRAND.muted, fontSize: 13 }}>
              Tip: Start with 4–8 courses for best results.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {visibleCourses.map(c => (
              <button
                key={c}
                onClick={() => toggleCourse(c)}
                style={{
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: 999,
                  padding: '7px 10px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                + {c}
              </button>
            ))}
          </div>
        </Card>

        {/* Step 2 */}
        <Card>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Step 2: Add interests (optional)</h2>
          <input
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Examples: helping people, technology, business, creative work…"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 12,
              border: `1px solid ${BRAND.border}`,
              outline: 'none'
            }}
          />

          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              disabled={selected.length === 0 || loading}
              onClick={explore}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: `1px solid ${BRAND.orange}`,
                background: selected.length === 0 ? BRAND.border : BRAND.orange,
                color: selected.length === 0 ? BRAND.muted : 'white',
                cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 700
              }}
            >
              {loading ? 'Exploring…' : 'Explore Pathways'}
            </button>

            <button
              onClick={() => { setSelected([]); setInterest(''); setResult(null); }}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: `1px solid ${BRAND.border}`,
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </Card>

        {/* Step 3 */}
        {result && (
          <Card>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Step 3: Your pathways</h2>
            <p style={{ color: BRAND.muted, marginTop: 0 }}>
              Mode: <b>{result.mode}</b>
            </p>

            <Section title="Skills you’re building" items={result.skills} />
            <Section title="College majors students often explore" items={result.majors} />
            <Section title="Industries to research" items={result.industries} />
            <Section title="Role families" items={result.roles} />

            <div style={{ marginTop: 14, color: BRAND.muted, fontSize: 13, lineHeight: 1.5 }}>
              {result.notes.map((n, i) => <div key={i}>• {n}</div>)}
            </div>
          </Card>
        )}

        <footer style={{ marginTop: 6, color: BRAND.muted, fontSize: 13, maxWidth: 860 }}>
          <strong>About EnrollHire</strong><br />
          EnrollHire is an exploration tool designed to support students and counselors.
          It does not recommend specific colleges, guarantee admission or employment,
          or replace academic or career advising.
        </footer>
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {items.map((x) => (
          <span
            key={x}
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: 999,
              padding: '6px 10px',
              background: '#F9FAFB'
            }}
          >
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
