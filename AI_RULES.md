# AI Development Rules for AI Test Correction System

This document outlines the technical stack and coding conventions to be followed by the AI assistant when developing and modifying this application. The goal is to ensure consistency, maintainability, and simplicity.

## Tech Stack

The application is built with a modern, lightweight tech stack focused on React and TypeScript.

*   **Framework**: [React](https://react.dev/) (v19) for building the user interface.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and robust code.
*   **Build Tool**: [Vite](https://vitejs.dev/) for fast development and optimized builds.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling approach. All styling should be done with Tailwind classes.
*   **AI Integration**: [Google Gemini API](https://ai.google.dev/) via the `@google/genai` package for all AI-powered features.
*   **Data Visualization**: [Recharts](https://recharts.org/) for creating charts and graphs in the dashboard and reports.
*   **State Management**: React's built-in hooks (`useState`, `useEffect`, `useMemo`) are used for local and global state management, with state lifted to the main `App.tsx` component.
*   **Data Persistence**: Client-side `localStorage` is used via a custom `useLocalStorage` hook to persist application data.

## Library Usage Rules

To maintain a lean and consistent codebase, adhere to the following rules for library and component usage.

*   **UI Components**:
    *   **General**: Create all new components as separate files within `src/components/`.
    *   **Common Components**: Use the existing components in `src/components/common/` (e.g., `Card`, `Modal`, `Spinner`, `Toast`) whenever possible. Do not install new libraries for these features.
    *   **Styling**: Style all components exclusively with **Tailwind CSS**. Do not add custom CSS files or use inline `style` attributes.

*   **Icons**:
    *   Use the custom SVG icon components provided in `src/components/Icons.tsx`. Do not add external icon libraries like Font Awesome or Lucide.

*   **State Management**:
    *   For component-level state, use `useState` and `useEffect`.
    *   For global state (e.g., students, simulados), continue the existing pattern of managing it within `App.tsx` and passing it down as props. Do not introduce state management libraries like Redux or Zustand.

*   **AI Service Layer**:
    *   All calls to the Gemini API must be encapsulated within the `src/services/geminiService.ts` file. Components should not interact directly with the `@google/genai` package.

*   **Charts and Graphs**:
    *   Use **Recharts** for all data visualization needs. Do not introduce other charting libraries like Chart.js or D3.js.

*   **Type Definitions**:
    *   All shared type definitions for the application's data structures (e.g., `Student`, `Simulado`) must be located in `types.ts`.