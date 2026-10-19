# Apple Notes-style search: evidence and implementation notes

## What the repository proves

This project currently implements a MERN note list, not a search engine.

- `frontend/src/components/Notes.tsx`: `fetchNotes()` calls `GET /api/notes`, stores the full response in `notes`, and renders each `note.content`. There is no search state, query parameter, filter UI, or result highlighting.
- `backend/src/controllers/noteController.ts`: `getNotes` queries `Note.find({ user: req.user._id })`; the ownership filter is server-side.
- `backend/src/models/note.ts`: a note has `user`, `content`, and `createdAt`; no title, tags, folders, attachments, or search metadata currently exist.
- `backend/src/routes/noteRoutes.ts`: the collection endpoint is protected by `protect` middleware.

## Apple Notes evidence vs. hypotheses

The earlier local inspection reported strings/symbols such as `ICSearchQueryOperation`, `ICSearchToken`, `ICSectionedSearchResults`, `ICSearchResultRegexMatchFinder`, and linkage to CoreSpotlight and Notes private frameworks. Those are reasonable investigation leads, but a string/symbol or a linked framework alone does **not** prove that a specific algorithm is executed, how results are ranked, or the precise user-visible query semantics. The current repository cannot independently corroborate those macOS binary observations.

Evidence needed for stronger Apple Notes claims:
1. Capture the exact macOS version and Notes binary/framework paths.
2. Preserve the outputs of `otool -L`, `nm -m`, and focused `strings` searches with file/version metadata.
3. Inspect relevant function bodies/call references with a native provider; symbols and strings alone are not enough to prove execution flow.
4. Run controlled UI searches against a disposable Notes dataset (title/body exact match, partial match, date recency, tags/folders, attachments) and record observed ordering and highlights.
5. Label conclusions as observed, statically inferred, or unknown.

## Implemented approximation in this project

The feature branch adds:
- an authenticated `GET /api/notes/search?q=...` endpoint that searches only the current user's notes;
- query normalization and a bounded query length;
- deterministic relevance buckets: exact whole-content match, prefix match, then substring match, followed by more recent edits;
- contextual snippets and offsets for client-side highlighting;
- debounced search input, clear state, match counts, empty state, and safe React text rendering.

This is an Apple Notes-inspired UX, not a claim of reproducing Apple's private implementation. It does not yet provide CoreSpotlight, attachment indexing, folders/tags, query-token operators, semantic search, or production-scale inverted indexing.
