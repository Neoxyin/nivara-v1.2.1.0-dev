# NIVARA Phase 2 — Fix Pass

Applied fixes from the Phase 2 issue audit:

- Fixed student and counsellor sign-out to fully clear the session and hard-return to the landing page.
- Fixed the landing-page 1-minute check-in action so unauthenticated users immediately get the student login modal instead of only changing the URL.
- Preserved workspace selection as an explicit **Get Started** action; it is not auto-opened on logout.
- Added/standardized contextual subtab behavior for check-in and support areas.
- Made AI Support a contextual subtab of Well-being Support instead of a detached destination.
- Promoted Support Circles to its own main student navigation tab and removed its duplicate content from Well-being Support.
- Removed duplicated counsellor top navigation so counsellor sections are represented once in the main sidebar.
- Removed the duplicate student Settings sidebar item and placed Settings under the Profile contextual navigation.
- Kept NIVARA branding links pointed at the home page and fixed sidebar logo hover clipping.
- Help/FAQ now opens with all questions collapsed.
- Counsellor Availability now shows an actual save confirmation toast.
- Improved Hindi/English switching for navigation, header actions, contextual subtabs, and primary section headings.
- Main student navigation now stays highlighted correctly for nested pages while keeping Support Circles separate from Well-being Support.

Validation:
- TypeScript/TSX syntax was parsed successfully for all modified files using TypeScript's transpiler.
- A full dependency-backed `tsc` build could not be completed in this environment because the uploaded project does not contain `node_modules` and dependency installation timed out.
