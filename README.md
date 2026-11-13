# OrgView — original modeler, fictional public edition

This edition derives from the existing OrgView single-file application, rather than the smaller replacement sandbox. The original interface and planning logic remain.

Download this repository as a ZIP, extract it, then open `public/index.html` directly in a browser. No Microsoft account, backend, installation, or API key is required to run the demo.

## Retained features

- Classic Tree, Radial, Swimlane, Roles First, and local feedback views.
- Current/future organization comparison, reporting-line edits, node attributes, groups, HRBP planning, multiple scenario tabs, undo/redo, and replay.
- Local JSON save/load, fictional CSV/Excel import and field mapping.
- Bundled spreadsheet, slide, PDF, and replay-video export code. Video availability depends on browser support.
- Tick-Tock planning and communication workbook generation.

## Public-demo changes

The starter is Aurora Robotics, with entirely invented names, roles, IDs, and reporting relationships. The downloadable template uses that same fictional organization.

Original company names, contact details, feedback-provider entries, executive references, export company metadata, and company-specific guidance were removed. Indicator thresholds are illustrative demo assumptions, not benchmarks.

All export libraries are bundled locally. The content security policy blocks application network connections. There is no backend, sign-in, model runtime, telemetry, or external dataset.

The original browser auto-save remains, isolated in `OrgViewPublicFictionalDB-v1`; it cannot restore the original application's database. **Clear local data** erases this demo's saved browser database and reloads the fictional starter. It does not erase downloaded files.

Optional imports and edits are processed on-device. Use fictional information only. Browser storage and downloaded files are not encrypted; do not enter real employee or confidential organizational information. Hosting services still receive normal page requests if this is later published.

## Build and checks

Requires Node.js 22 or later. No dependency installation.

```powershell
npm test
npm run build
```

The `public` directory is the static hosting artifact. `src/orgview.html` contains the reviewable original application adaptation; `vendor` contains the existing bundled libraries with retained headers and upstream license texts. License notices are also embedded in the built file and accessible from Credits.

This folder contains no original repository history, enterprise configuration, employee data files, or backend services. The original OrgView source directory is not modified.
