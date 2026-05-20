# Kedco Admin CMS

A modern admin content management system built with **Next.js 15**, **Tailwind CSS**, and **shadcn/ui**.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Language:** TypeScript
- **Font:** SF Pro Text (system font) with fallbacks
- **Code Formatting:** Prettier

---

## Design Tokens

Brand colors used across the app:

| Token     | Hex       | Usage                      |
| --------- | --------- | -------------------------- |
| Primary   | `#0C1A7F` | Buttons, links, highlights |
| Secondary | `#F9F9F9` | Backgrounds, subtle fills  |

---

## Code Formatting (Prettier)

This project uses **Prettier** to enforce consistent code style across all contributors.

### Key Rules

| Rule            | Value         |
| --------------- | ------------- |
| Quotes          | Double quotes |
| Semicolons      | true          |
| Tab Width       | 2 spaces      |
| Trailing Commas | es5           |
| Print Width     | 80            |
| End of Line     | lf            |

### Commands

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

> All developers must have the **Prettier - Code Formatter** VS Code extension installed (`esbenp.prettier-vscode`).
> The project is configured to auto-format on save via `.vscode/settings.json`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd kedco-admin-cms

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

---

## Contributing

1. Make sure you have the **Prettier** VS Code extension installed.
2. The project auto-formats on save via `.vscode/settings.json`.
3. Run `npm run format:check` before pushing.
4. Follow the existing folder and file naming conventions.

---

## License

Private — Kedco Admin CMS. All rights reserved.
# frontend
