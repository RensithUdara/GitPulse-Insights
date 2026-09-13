import { ThemeColors } from '@/types/github';

const inkDark: ThemeColors = {
  background: '#10100e',
  backgroundGradient: '#10100e',
  cardBackground: '#1b1916',
  border: '#3b342b',
  title: '#f39a4d',
  text: '#f8eedf',
  textSecondary: '#b9ab96',
  accent: '#f39a4d',
  accentSecondary: '#4cc9bd',
  iconColor: '#f39a4d',
  contributionLevels: ['#201d19', '#473321', '#83552e', '#c5763a', '#f39a4d'],
};

const paperLight: ThemeColors = {
  background: '#f4f1ea',
  backgroundGradient: '#f4f1ea',
  cardBackground: '#fffaf0',
  border: '#d8cab5',
  title: '#0f7b77',
  text: '#241f1a',
  textSecondary: '#756956',
  accent: '#0f7b77',
  accentSecondary: '#b85f28',
  iconColor: '#0f7b77',
  contributionLevels: ['#e8dece', '#b9d4c8', '#7eb9ac', '#3d9991', '#0f7b77'],
};

export const themes: Record<string, ThemeColors> = {
  ink_dark: inkDark,
  paper_light: paperLight,

  graphite: {
    background: '#171717',
    backgroundGradient: '#171717',
    cardBackground: '#222222',
    border: '#3a3a3a',
    title: '#d0a85c',
    text: '#eeeeee',
    textSecondary: '#a3a3a3',
    accent: '#d0a85c',
    accentSecondary: '#8fb7aa',
    iconColor: '#d0a85c',
    contributionLevels: ['#292929', '#3f3a28', '#6d5a30', '#a9833e', '#d0a85c'],
  },

  copper: {
    background: '#211710',
    backgroundGradient: '#211710',
    cardBackground: '#2e2119',
    border: '#513827',
    title: '#d88945',
    text: '#f5e6d3',
    textSecondary: '#c3aa91',
    accent: '#d88945',
    accentSecondary: '#9fbf8d',
    iconColor: '#d88945',
    contributionLevels: ['#38271d', '#5a3520', '#87502b', '#b86c36', '#d88945'],
  },

  moss: {
    background: '#151a14',
    backgroundGradient: '#151a14',
    cardBackground: '#20271d',
    border: '#3a4632',
    title: '#98b56a',
    text: '#edf2df',
    textSecondary: '#adb99d',
    accent: '#98b56a',
    accentSecondary: '#d0a85c',
    iconColor: '#98b56a',
    contributionLevels: ['#283023', '#3d4a2d', '#5b6d3e', '#78904f', '#98b56a'],
  },

  harbor: {
    background: '#0f1a1c',
    backgroundGradient: '#0f1a1c',
    cardBackground: '#172629',
    border: '#294348',
    title: '#61b8aa',
    text: '#e7f2ef',
    textSecondary: '#9cb8b2',
    accent: '#61b8aa',
    accentSecondary: '#d0a85c',
    iconColor: '#61b8aa',
    contributionLevels: ['#1d3033', '#254b4e', '#2f6869', '#438d87', '#61b8aa'],
  },

  plum: {
    background: '#1d1720',
    backgroundGradient: '#1d1720',
    cardBackground: '#2a2230',
    border: '#46374f',
    title: '#b995d6',
    text: '#f1e8f7',
    textSecondary: '#b9a5c5',
    accent: '#b995d6',
    accentSecondary: '#d0a85c',
    iconColor: '#b995d6',
    contributionLevels: ['#34293c', '#493359', '#67457d', '#8b66a9', '#b995d6'],
  },

  stone: {
    background: '#e8e2d8',
    backgroundGradient: '#e8e2d8',
    cardBackground: '#f9f5ed',
    border: '#cac0b1',
    title: '#6b6258',
    text: '#26231f',
    textSecondary: '#71685f',
    accent: '#6b6258',
    accentSecondary: '#0f7b77',
    iconColor: '#6b6258',
    contributionLevels: ['#ddd4c6', '#c8bdac', '#a99b87', '#867766', '#6b6258'],
  },

  dark: inkDark,
  github_dark: inkDark,
  github_light: paperLight,
};

themes.radical = themes.plum;
themes.tokyonight = themes.harbor;
themes.dracula = themes.plum;
themes.synthwave = themes.copper;
themes.ocean = themes.harbor;
themes.ocean_radical = themes.harbor;
themes.neo_green = themes.moss;

export function getTheme(themeName: string): ThemeColors {
  return themes[themeName] || themes.ink_dark;
}
