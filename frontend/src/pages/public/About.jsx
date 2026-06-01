import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto rounded-3xl bg-white p-8 shadow-lg border-2 border-primary-200">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
          <h1 className="text-3xl font-bold text-primary-900">
            About TRI·NETRA
          </h1>
        </div>
        <p className="text-gray-600 leading-7">
          <strong className="font-bold"> About TRI-NETRA Tuition Center</strong>
          <br />
          TRI-NETRA Tuition Center was established in 2082 B.S. with a single,
          unwavering purpose — to provide quality education that goes beyond
          textbooks and truly prepares students for life. Nestled in the heart
          of Godawari-3, Taukhel, Lalitpur, we have grown into one of the most
          trusted academic support centers for students from Class 3 to Class
          12. The name TRI-NETRA — meaning "three eyes" — reflects our vision of
          developing students across three essential dimensions: academic
          excellence, personal growth, and future readiness. Just as the three
          eyes symbolize clarity, wisdom, and foresight, we guide every student
          to see beyond their immediate challenges and unlock their full
          potential. <br />
          <br />
          <strong>Our Story </strong>
          <br />
          TRI-NETRA was born from a deep concern for the growing academic
          pressure faced by students in Nepal's education system. Our founders
          recognized that students needed more than just a classroom — they
          needed a nurturing space where personalized attention, structured
          learning, and genuine care came together. What began as a small group
          of dedicated teachers and a handful of students has blossomed into a
          full-fledged digital learning institution, serving over a hundred
          students across three carefully scheduled batches every single day.{" "}
          <br />
          <br />
          <strong>What Makes Us Different</strong> <br />
          At TRI-NETRA, we believe that every student learns differently. That
          is why we keep our batch sizes small and our teaching approach
          personal. Our experienced teachers do not simply deliver lessons —
          they observe, adapt, and connect with each student individually.
          Whether a student is struggling with the fundamentals of arithmetic in
          Class 3 or preparing for the critical SLC and +2 examinations, our
          team provides the right guidance at the right time. <br />
          <br />
          We also embrace modern technology to make learning and management
          seamless. From QR-based attendance to digital fee tracking and
          performance reports, TRI-NETRA runs on a fully digital platform that
          keeps students, teachers, and parents informed and connected at all
          times. <br />
          <br />
          Our Batches
          <br />
          We offer three flexible batch timings designed to suit every student's
          daily schedule: <br />
          Morning Batch — 6:00 AM to 8:00 AM, ideal for students who prefer to
          study before school
          <br /> Day Batch — 11:00 AM to 1:00 PM, perfect for those with
          afternoon school shifts
          <br /> Evening Batch — 4:00 PM to 6:00 PM, suited for students who
          attend morning school
          <br />
          <br /> Each batch is led by subject-specialist teachers who are
          passionate, qualified, and deeply committed to student success. <br />
          <br />
          Our Commitment <br />
          We are committed to maintaining an environment that is safe,
          respectful, and intellectually stimulating. We celebrate every small
          victory a student achieves — a better test score, improved confidence,
          a concept finally understood. We communicate openly with parents and
          keep them involved in their child's academic journey through regular
          reports and updates.
          <br /> Fees are kept affordable at Rs. 3,000 per month, with flexible
          installment options available, because we firmly believe that
          financial constraints should never stand between a child and a quality
          education. <br />
          <br />
          Our Vision <br />
          To be the most trusted academic foundation in Lalitpur — a place where
          every student who walks through our doors leaves more confident, more
          capable, and more prepared to face the world.
          <br /> Our Mission <br />
          To deliver personalized, high-quality education to students of Class 3
          through Class 12 by combining experienced teaching, a supportive
          learning environment, and modern digital tools — empowering every
          student to achieve their highest potential. <br />
          <br />
          TRI-NETRA Tuition Center — Godawari-3, Taukhel, Lalitpur 📞 9840456962
          / 9761498436 🌐 www.trinetratuitioncenter.com
        </p>
        <div className="mt-6 space-x-3">
          <Link
            className="rounded-2xl bg-primary-600 text-white px-4 py-3 hover:bg-primary-700 transition inline-block"
            to="/"
          >
            Home
          </Link>
          <Link
            className="rounded-2xl border-2 border-primary-300 text-primary-600 px-4 py-3 hover:bg-primary-50 transition inline-block"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
