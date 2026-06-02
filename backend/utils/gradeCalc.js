export function calculateNepalGrade(marks, total) {
  const pct = total ? (marks / total) * 100 : 0;
  if (pct >= 90) return { grade: "A+", gpa: 4.0 };
  if (pct >= 80) return { grade: "A", gpa: 3.6 };
  if (pct >= 70) return { grade: "B+", gpa: 3.2 };
  if (pct >= 60) return { grade: "B", gpa: 2.8 };
  if (pct >= 50) return { grade: "C+", gpa: 2.4 };
  if (pct >= 40) return { grade: "C", gpa: 2.0 };
  if (pct >= 35) return { grade: "D", gpa: 1.6 };
  return { grade: "E", gpa: 0.0 };
}

export function calculateNepalGpa(marks, total) {
  return calculateNepalGrade(marks, total).gpa;
}
