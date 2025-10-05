export const SIDEBAR_KEY = 'kanva_sidebar_collapsed';

export const loadSidebarCollapsed = (): boolean => {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY);
    return raw ? JSON.parse(raw) : false;
  } catch (e) {
    return false;
  }
};

export const saveSidebarCollapsed = (val: boolean) => {
  try {
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
};
