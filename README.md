# NIVARA

### A holistic student support platform bridging academic performance, financial support, and mental well-being.

NIVARA is a consent-first student support platform designed to identify potential academic, financial, and well-being support needs before problems escalate.

**Core Principle: Support Before the Breaking Point**

## What NIVARA Does

NIVARA follows:

**Identify → Explain → Support → Connect → Follow Up → Improve**

It helps students understand their support needs, discover relevant resources, connect with counsellors and campus services, and maintain control over their data.

### Three Support Pillars

- **Academic Support** — advisors, mentors, tutoring, study resources, exam preparation, and placement support.
- **Financial Support** — scholarships, fee assistance, emergency funds, hostel/food assistance, transportation support, and institutional schemes.
- **Well-being Support** — consent-based check-ins and trends connecting students with counsellors, resources, support spaces, and support circles.

## Privacy & Student Agency

- **Minimal Data** — collect only what is necessary.
- **Consent First** — optional data is used only with appropriate consent.
- **Explainability** — recommendations explain why they were shown.
- **Student Agency** — students can view, control, and request corrections to their data.
- **Non-Punitive Support** — support signals cannot automatically become academic or disciplinary punishment.

NIVARA maintains separate support dimensions:

**Academic Support Need | Financial Support Need | Well-being Support Need**

## Support Intelligence

The MVP uses a transparent, deterministic **Support Need Engine** instead of an unvalidated predictive ML model.

It evaluates signals such as attendance trends, academic performance, overdue assignments, academic stress, requests for help, financial difficulty, and well-being check-ins.

## Student Portal

- Personalized dashboard
- Well-being check-ins
- Academic tracking
- Financial support navigator
- Support recommendations
- Counsellor discovery and appointments
- Resources and support spaces
- Privacy and consent controls
- Profile management
- Data transparency and correction requests

## Counsellor Portal

- Today's sessions
- Appointment management
- Student roster
- Support alerts
- Student support profiles
- Session notes
- Follow-ups
- Availability and profile management

## Admin Portal

- Campus support overview
- Academic and financial demand
- Well-being trends
- Support need trends
- Fairness monitoring
- Consent audit information
- Support resources and programs
- System health
- Student correction request management


## Tech Stack

- Next.js 14 / React 18
- TypeScript
- Tailwind CSS
- Radix UI / shadcn-style components
- Framer Motion
- GSAP
- TanStack Query
- Recharts
- React Hook Form + Zod
- Lucide React


## Project Structure

src/
├── app/              # Next.js routes and portals
├── components/       # UI and feature components
├── hooks/            # Shared React hooks
├── lib/
│   ├── api/          # Mock API layer
│   ├── auth/         # Mock authentication
│   ├── data/         # Seeded mock datasets
│   ├── intelligence/ # Support Need Engine
│   ├── types/        # Shared TypeScript types
│   └── gsap/         # Animation utilities
├── public/            # Static assets
└── tests/             # Support engine tests

## Getting Started

### Requirements

- Node.js 20+
- npm

### Install

npm ci

### Run Development Server

npm run dev

Open http://localhost:3000

### Production Build

npm run build
npm start

### Type Check

npm run typecheck

### Lint

npm run lint

### Tests

npm run test:support-engine


**NIVARA supports students before the breaking point — not after.**
