export const setThemeVariables = () => {
  const root = document.documentElement
  root.style.setProperty('--main-color', import.meta.env.VITE_MAIN_COLOR)
  root.style.setProperty('--main-dark', import.meta.env.VITE_MAIN_DARK)
  root.style.setProperty('--main-light', import.meta.env.VITE_MAIN_LIGHT)
}