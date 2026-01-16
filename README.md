# Birthday Countdown 🎂

A beautiful, interactive birthday countdown application built with React, TypeScript, and Vite. This project features a sophisticated particle system, a smooth image gallery, and a magical celebration animation when the timer hits zero.

## ✨ Features

- **🎯 Precision Countdown**: Real-time countdown to the special day (Days, Hours, Minutes, Seconds).
- **🎨 Interactive Particle System**: 
  - Dynamic particles forming the name of the birthday person.
  - Interactive mouse repulsion effect.
  - Multi-stage celebration animation:
    - **Pigeon Formation**: Particles gather to form a flying pigeon.
    - **Flight Sequence**: The pigeon flies across the screen with flapping wings.
    - **Metamorphosis**: The pigeon "burns" into a fire effect and transforms into "HAPPY BIRTHDAY".
- **🎵 Atmospheric Music**: Automatic music playback when the celebration begins.
- **🖼️ Background Gallery**: Smoothly transitioning background images using Framer Motion.
- **📱 Fully Responsive**: Built with Material UI and Bootstrap 5 for a seamless experience across all devices.
- **🌍 Localization**: Supports Unicode characters for regional languages (e.g., Odia).

## 🚀 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Material UI (MUI)](https://mui.com/) & [Bootstrap 5](https://getbootstrap.com/)
- **Graphics**: HTML5 Canvas (Custom Particle Engine)

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/birthday-countdown.git
   cd birthday-countdown
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## ⚙️ Configuration

You can easily customize the countdown by editing `src/constants.ts`:

```typescript
export const CONSTANTS = {
  TARGET_DATE: '2026-01-16T23:59:59', // Target date and time
  PERSON_NAME: 'G U D D I',           // Name of the birthday person
  EVENT_NAME: 'ଜନ୍ମଦିନର ଶୁଭେଚ୍ଛା',      // Event message (supports Unicode)
  MUSIC_URL: '...',                   // URL for the celebration music
  IMAGES: [                           // Gallery image URLs
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...',
  ],
};
```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
