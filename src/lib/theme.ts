export type ThemeTokens = {
  background: string;
  particleBase: [number, number, number];
  particleHover: [number, number, number];
  textPrimary: string;
  textSecondary: string;
  textEyebrow: string;
};

export const themeTokens: ThemeTokens = {
  background: "rgb(0, 0, 0)",
  particleBase: [0.66, 0.66, 0.66],
  particleHover: [0.82, 0.82, 0.82],
  textPrimary: "rgb(245, 245, 245)",
  textSecondary: "rgb(212, 212, 212)",
  textEyebrow: "rgb(170, 170, 170)",
};
