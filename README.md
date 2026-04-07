# Interactive Wall Calendar - Frontend Challenge

This project is a React-based interactive wall calendar built for a frontend engineering assessment. The goal was to create a functional, responsive calendar component that mimics the look and feel of a physical wall calendar.

## Live Demo
[Link to Live Demo](https://calendily-calendar.netlify.app/)

## Key Features

- **Wall Calendar Design**: Styled with a binder-ring aesthetic and large hero images to look like a real wall calendar.
- **Date Range Selection**: Users can click to select a start and end date. The range is visually highlighted across the grid.
- **Notes Feature**: 
  - Supports general monthly notes.
  - Allows adding specific notes to selected dates.
  - Data persists using `localStorage`.
- **Responsive Layout**: The UI automatically adjusts for desktop and mobile screens.
- **Animations**: Uses Framer Motion for smooth month transitions and hover effects.

## Tech Stack

- **React**: Core library for the UI.
- **Tailwind CSS**: Used for all styling and responsive design.
- **Framer Motion**: For the "page-flip" animations between months.
- **date-fns**: For handling calendar logic and date formatting.
- **Lucide React**: Icon library.
- **Vite**: Build tool and dev server.

## How to Run Locally

1. Clone this repo.
2. Run `npm install` to get the dependencies.
3. Run `npm run dev` to start the local server.
4. Open `http://localhost:3000` in your browser.

## Project Structure

- `src/components/Calendar.jsx`: Main calendar component containing the grid and logic.
- `src/App.jsx`: Root component and layout wrapper.
- `src/index.css`: Tailwind configuration and custom global styles.
- `src/lib/utils.js`: Helper for conditional CSS classes.

## Implementation Details

- **State Management**: Used React's `useState` and `useMemo` to handle the calendar grid and range selection efficiently.
- **Persistence**: Implemented a simple `useEffect` hook to sync the notes array with `localStorage`.
- **Styling**: Leveraged Tailwind's grid system to ensure the calendar remains perfectly aligned across all screen sizes.
