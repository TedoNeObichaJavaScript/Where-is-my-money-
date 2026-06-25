/** z-index scale for stacked holographic layers. */
export const elevation = {
  base: 0,
  orbs: 1, // nebula light-leaks behind content
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
