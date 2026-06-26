/** z-index scale for stacked layers. */
export const elevation = {
  base: 0,
  content: 10,
  header: 20,
  tabBar: 30,
  fab: 35, // center Add button rides above the tab bar
  sheet: 40,
  toast: 50,
  modal: 60,
  overlay: 70,
} as const;

export type Elevation = keyof typeof elevation;
