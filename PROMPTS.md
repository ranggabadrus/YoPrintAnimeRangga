# PROMPTS.md

This document records all AI-assisted interactions used during the development of the **Anime Search App** project.  
Each section lists the prompt, the AI tool used, and what part of the project it helped with.

---

## Project Setup

**Prompt:**

> "Act as senior React developer with expertise in TypeScript, Redux, and performance optimization, you are going to join YoPrint team. You have a take home coding assignment. It is a mini react project to build anime search app.

---

## Routing Setup

**Prompt:**

> "Install and configure react-router-dom v6 with TypeScript for two pages — Search and Detail pages. Generate a clean, responsive anime search UI"

---

## Redux Store Configuration

**Prompt:**

> "Set up Redux Toolkit with TypeScript for managing state. Use thunk to communicate with API, handle loading, error states and store data in to reducer."

---

## API Integration

**Prompt:**

> "Fetch anime search results from Jikan API with pagination support in React using fetch. Handle API errors and show user-friendly messages or empty states"

---

## Debounced Search

**Prompt:**

> "The search should automatically call the API without pressing Enter, and cancel any ongoing API request if the user continues typing."

---

## Pagination

**Prompt:**

> "Implement pagination for the anime search results. The pagination should be displayed at the bottom of the search results page. The pagination should be displayed for both the search results and the popular anime list. Each page consists of 24 anime."

---

## Bonus Implementations

### Dark Mode

**Prompt:**

> "Add dark mode support to the app using CSS variables and local storage. The default theme must follow default of browser theme. Allow user to switch between light and dark mode."

---

### Filter Search

**Prompt:**

> "Add filter function that allow user to filter anime by type("tv" "movie" "ova" "special" "ona" "music" "cm" "pv" "tv_special"), year(1950 to current year), score("1" to "10"), status("airing" "complete" "upcoming"), rating("g" "pg" "pg13" "r17" "r" "rx"). The filter should be displayed at the top of the search results page."

---

### Sort/Order by Search

**Prompt:**

> "Add sort function that allow user to sort anime by "mal_id", "title", "start_date" "end_date", "episodes", "score", "rank", "popularity", and "members". The sort should be displayed at the top of the search results page."

---

### Individual clear filter and search

**Prompt:**

> "Show chips for each filter and search input. Add x icon beside chips to allow user clear filter and search input. Show chips top of result page and below filter bar."

---

### Unit Test

**Prompt:**

> "Add unit test for the app using Jest and React Testing Library. Ensure test coverage is 100%."

---
