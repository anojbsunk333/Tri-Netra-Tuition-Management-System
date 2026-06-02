export function calculateGrade(marks, total) {
  const percentage = total ? (marks / total) * 100 : 0;
  if (percentage >= 90) return { grade: "A+", gpa: 4.0 };
  if (percentage >= 80) return { grade: "A", gpa: 3.6 };
  if (percentage >= 70) return { grade: "B+", gpa: 3.2 };
  if (percentage >= 60) return { grade: "B", gpa: 2.8 };
  if (percentage >= 50) return { grade: "C+", gpa: 2.4 };
  if (percentage >= 40) return { grade: "C", gpa: 2.0 };
  if (percentage >= 35) return { grade: "D", gpa: 1.6 };
  return { grade: "E", gpa: 0.0 };
}

export function formatGrade(marks, total) {
  return calculateGrade(marks, total);
}
