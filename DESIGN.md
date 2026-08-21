---
name: MΛSTISHK
colors:
  primary: "#9e3d00"
  secondary: "#76574e"
  background: "#fbf9f1"
typography:
  fontFamily: "Plus Jakarta Sans"
  baseSize: "16px"
spacing:
  base: "8px"
rounded:
  md: "1rem"
---

## Overview
MΛSTISHK's design system is built on Tailwind CSS v3 and utilizes a warm, earthy color palette. It incorporates modern aesthetic principles such as glassmorphism and subtle micro-animations to create a premium, engaging user experience. The design heavily relies on semantic tokens inspired by Material Design 3.

## Colors
- **Background**: Uses `#fbf9f1` (`background`, `surface`, `surface-bright`) as the foundation for a warm, welcoming feel.
- **Primary**: Uses `#9e3d00` for primary actions, buttons, and prominent highlights.
- **Secondary**: Uses `#76574e` for secondary text and supportive UI elements.
- **Selection**: Custom selection styling uses `#ffdbd0` for background and `#2c160f` for text.
- **Usage**: Always rely on semantic color tokens (e.g., `text-primary`, `bg-surface-container`) rather than hardcoding hex values.

## Typography
- **Font Family**: Plus Jakarta Sans is the exclusive font family for the application, loaded via Google Fonts.
- **Hierarchy**:
  - `headline-xl` (40px/700) for major page titles.
  - `headline-lg` (32px/700) and `headline-md` (24px/600) for section headers.
  - `body-lg` (18px) and `body-md` (16px) for standard body copy.
  - `label-md` (14px) and `label-sm` (12px) for UI labels and metadata.

## Layout & Spacing
- **Grid and Container**: The maximum container width is constrained to `1200px` (`container-max`).
- **Padding and Margins**:
  - Mobile margin: `16px`
  - Desktop margin: `40px`
  - Gutter spacing: `24px`
- **Spacing Scale**: The base unit is `8px`, with custom values provided in the Tailwind configuration for consistent vertical and horizontal rhythm.

## Components
- **Buttons and Cards**: Should utilize the custom border-radius values (DEFAULT: `1rem`, lg: `2rem`, xl: `3rem`).
- **Visual Effects**: 
  - Use the `.bloom-shadow-primary` class for a glowing, soft shadow effect on prominent elements.
  - Use the `.glass-panel` class for frosted glass effects (blur and semi-transparent background).
- **Animations**: Leverage custom animations (`animate-gentle-bounce`, `animate-slow-pulse-*`, `animate-fade-in-up`) for micro-interactions and dynamic page elements.

## Do's and Don'ts
- **Do** use the defined semantic color tokens from `tailwind.config.js`.
- **Do** apply the `.glass-panel` class for layered UI elements to maintain depth.
- **Do** utilize the custom keyframes (`gentleBounce`, `slowPulse`, `fadeInUp`) for a dynamic and responsive design.
- **Don't** introduce new font families; stick to Plus Jakarta Sans.
- **Don't** hardcode hex colors in style tags or CSS files outside of the Tailwind configuration.
- **Don't** use arbitrary spacing values; rely on the defined spacing scale.
