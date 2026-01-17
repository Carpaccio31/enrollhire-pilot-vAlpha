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
  if (['Biology','Chemistry','Physics','Environmental Science','AP]()
