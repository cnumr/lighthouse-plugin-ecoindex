# Best-Practices Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate JSON and Markdown reports of RWEB and generic eco-design best practices by course and page.

**Architecture:** `converters.ts` extracts binary `rweb-*` and `bp-*` audit data for JSON. `printer.ts` orchestrates file reading, writes both reports, and renders Markdown including the source audit `details`. Existing E2E scenarios generate the artifacts; visual validation of their rendered Markdown remains the user's responsibility.

**Tech Stack:** TypeScript, Node.js `fs`, Lighthouse User Flow results, pnpm.

## Global Constraints

- Keep the current responsibility split: `printer.ts` drives output; `converters.ts` holds conversion methods only.
- Support only navigation steps (`gatherMode === 'navigation'`).
- Include only `rweb-*` and `bp-*` audits whose score is exactly `1` or `0`.
- Set `status: 'OK'` for score `1` and `status: 'KO'` for score `0`; retain their source order within each prefix section.
- Each page always contains the `rweb` section titled `Bonnes pratiques RWEB` and the `bp` section titled `Bonnes pratiques generiques d'ecoconception`.
- Reserve `<exportPath>/summary/` for aggregate outputs: `report.json`, `best-practices.report.json`, and `best-practices.report.md`; never write aggregate outputs beside course reports.
- Trigger aggregate generation when `cliFlags.outputFiles.json` has source files, including statement mode; skip it for HTML-only runs.
- JSON excludes `details`, `scoreDisplayMode`, `numericValue`, and `numericUnit`.
- Markdown excludes `score`, `scoreDisplayMode`, `numericValue`, and `numericUnit`; it renders `details` only for `KO` audits in a closed native HTML `<details>` block.
- Markdown writes `displayValue` immediately below an audit title.
- Do not add or modify tests. Existing E2E commands remain the automated verification; the user validates rendering visually.
- Do not add runtime dependencies.

---

## File Structure

- Modify: `libs/ecoindex-lh-courses/src/types/index.d.ts`
  Declares the generated JSON report structure.
- Modify: `libs/ecoindex-lh-courses/src/converters.ts`
  Selects and sanitizes audit values for JSON output.
- Modify: `libs/ecoindex-lh-courses/src/printer.ts`
  Generates aggregate files in the reserved `summary/` directory, including Markdown-only details rendering.
- Modify: `.changeset/quiet-readers-complain.md`
  Describes the published feature.

### Task 1: Convert Best-Practice Audits

**Files:**
- Modify: `libs/ecoindex-lh-courses/src/types/index.d.ts:152-162`
- Modify: `libs/ecoindex-lh-courses/src/converters.ts:1-150`

**Interfaces:**
- Produces: `convertBestPracticesPageResults(lhr: LH.Result): BestPracticesPage`
- Produces: `BestPracticeAudit`, `BestPracticeSection`, `BestPracticesPage`, and `BestPracticesCourseReport`.

- [ ] **Step 1: Define the generated-report types**

Add these declarations to `libs/ecoindex-lh-courses/src/types/index.d.ts`:

```ts
export interface BestPracticeAudit {
  status: 'OK' | 'KO'
  [key: string]: unknown
}

export interface BestPracticeSection {
  title: string
  bestPractices: BestPracticeAudit[]
}

export interface BestPracticesPage {
  url: string
  rweb: BestPracticeSection
  bp: BestPracticeSection
}

export interface BestPracticesCourseReport {
  report: string
  pages: BestPracticesPage[]
}
```

- [ ] **Step 2: Implement the conversion methods in `converters.ts`**

Add a private audit copy method that omits `details`, `scoreDisplayMode`, `numericValue`, and `numericUnit`; rejects scores other than exactly `0` and `1`; and adds `status` after copying. Add `convertBestPracticesPageResults` that initializes both sections, iterates `lhr.audits` in insertion order, and appends each qualifying audit to the matching `rweb` or `bp` section.

- [ ] **Step 3: Verify the package compiles**

Run: `pnpm --filter lighthouse-plugin-ecoindex-courses build && pnpm typecheck:strict`

Expected: both commands exit with status 0.

### Task 2: Generate The JSON And Markdown Reports

**Files:**
- Modify: `libs/ecoindex-lh-courses/src/printer.ts:274-351`

**Interfaces:**
- Consumes: `convertBestPracticesPageResults(lhr)` from Task 1.
- Produces: `summary/best-practices.report.json` and `summary/best-practices.report.md` at `cliFlags.exportPath`.

- [ ] **Step 1: Add JSON report orchestration**

Create a private `printBestPracticesReport(cliFlags)` beside `printSummary`. It creates `<exportPath>/summary/`, reads each path in `cliFlags.outputFiles.json`, retains navigation steps, builds `BestPracticesCourseReport` values with `path.basename(jsonFile)`, and writes `summary/best-practices.report.json` with tab indentation.

- [ ] **Step 2: Add Markdown report rendering in `printer.ts`**

Render the report with this hierarchy: document title, course heading, page heading, `Bonnes pratiques RWEB`, then `Bonnes pratiques generiques d'ecoconception`. Render audits in source order as a level-5 heading containing `[OK]` or `[KO]` and the audit title. Write `displayValue` on the line immediately under that heading. Write remaining retained fields as Markdown bullets. Emit `Aucune bonne pratique n'est disponible.` for an empty section.

Render `audit.details` only for a `KO` audit in the Markdown path. Wrap it in:

```md
<details>
<summary>Details de l'audit</summary>

...rendered content...

</details>
```

For `table` and `opportunity`, use the audit headings and items to produce a Markdown table. For `list`, produce Markdown bullets. For another `details.type`, use a fenced formatted JSON block.

- [ ] **Step 3: Call the new report generator**

Change `printSummary` to write `summary/report.json`, then call `printBestPracticesReport(cliFlags)` in that same reserved directory. In `run.ts`, call `printSummary` whenever `cliFlags.outputFiles.json` contains source reports, rather than checking only whether the requested output includes `json`. Preserve existing summary output and log messages.

- [ ] **Step 4: Verify the package compiles**

Run: `pnpm --filter lighthouse-plugin-ecoindex-courses build && pnpm typecheck:strict`

Expected: both commands exit with status 0.

### Task 3: Validate The Existing E2E Workflow

**Files:**
- Modify: `.changeset/quiet-readers-complain.md`

**Interfaces:**
- Consumes: course report files generated by the existing E2E scenario.
- Produces: generated best-practice report artifacts for user visual review.

- [ ] **Step 1: Update release metadata**

Ensure the changeset body is:

```md
Generate JSON and Markdown reports of RWEB and generic eco-design best-practice results by course and page.
```

- [ ] **Step 2: Run the existing E2E scenario**

Run: `pnpm --filter @ecoindex-lh-test/courses test:file`

Expected: the existing file-course scenario exits with status 0 and generates `summary/report.json`, `summary/best-practices.report.json`, and `summary/best-practices.report.md` below its timestamped report directory.

- [ ] **Step 3: Present the generated Markdown for visual validation**

Provide the exact generated report path to the user. The user reviews the Markdown rendering, including the headings, section split, `displayValue` placement, and collapsed details blocks.

- [ ] **Step 4: Run final repository verification**

Run: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm typecheck:strict && pnpm test`

Expected: every command exits with status 0. `pnpm test` runs sequentially through the repository script.

- [ ] **Step 5: Update the knowledge graph**

Run: `graphify update .`

Expected: graph metadata reflects the code changes.

## Plan Self-Review

- Spec coverage: Tasks 1 and 2 cover prefix filtering, strict binary status, sections by prefix, excluded JSON fields, Markdown-only details, display-value placement, empty sections, and source ordering.
- Testing: no tests are added or modified. Task 3 uses the repository's existing E2E scenario and hands visual validation to the user.
- Responsibility split: conversion remains in `converters.ts`; report orchestration and Markdown rendering remain in `printer.ts`.
