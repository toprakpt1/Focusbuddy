<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License: GPL v3][license-shield]][license-url]
[![F-Droid][fdroid-shield]][fdroid-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/toprakpt1/Focusbudy">
    <img src="assets/focusbuddy.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">FocusBuddy</h3>

  <p align="center">
    A cute, privacy-first Pomodoro companion to help you stay focused.
    <br />
    <a href="https://github.com/toprakpt1/Focusbudy/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/toprakpt1/Focusbudy/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
    &middot;
    <a href="README.tr.md">Türkçe</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#privacy">Privacy</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

FocusBuddy is a **privacy-first, open-source Pomodoro timer** for Android, wrapped in a cozy, gamified experience. Choose a little animal companion, start a focus session, and let your buddy keep you company while you work. Complete sessions to earn XP, level up, unlock new companions, and build a daily streak.

This app is built for people who want a **distraction-free, offline-friendly** focus tool without ads, trackers, or subscription walls.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React Native][ReactNative-shield]][ReactNative-url]
* [![Expo][Expo-shield]][Expo-url]
* [![TypeScript][TypeScript-shield]][TypeScript-url]
* [![Zustand][Zustand-shield]][Zustand-url]
* [![i18next][i18next-shield]][i18next-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (LTS recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Android Studio](https://developer.android.com/studio) (for local Android builds)
* [Java 17](https://openjdk.org/) or later

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/toprakpt1/Focusbudy.git
   cd Focusbudy
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Start the development server
   ```sh
   npx expo start
   ```
4. Build for Android (F-Droid / local APK)
   ```sh
   npx expo prebuild --platform android
   cd android
   ./gradlew assembleRelease
   ```
   The unsigned APK will be located at `android/app/build/outputs/apk/release/app-release-unsigned.apk`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FEATURES -->
## Features

- **Pomodoro Timer** — Focus & break cycles with customizable durations (10s test, 25 min, 45 min, 60 min)
- **Animal Companions** — Choose a buddy; unlock more as you level up
- **XP & Level System** — Earn XP for every completed session
- **Daily Streaks** — Keep your streak alive with consistent focus sessions
- **Focus Heatmap** — Visualize your productivity over time
- **Themes** — Warm pastel, Dark, and Paper themes
- **Notifications** — Session end and streak reminders (optional)
- **Keep Screen On** — Prevent display timeout during sessions
- **Fully Offline** — No internet required; no trackers, no ads
- **Bilingual** — English & Turkish support (more languages welcome!)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- SCREENSHOTS -->
## Screenshots



| Home & Timer | Profile & Stats | Shop |
|---|---|---|
| ![Screenshot 1][screenshot-1] | ![Screenshot 2][screenshot-2] | ![Screenshot 3][screenshot-3] |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

1. **Onboarding** — Launch the app and pick your first companion.
2. **Start a Session** — Tap "Start Focus" on the home screen.
3. **Stay Focused** — Your buddy stays with you while the timer runs.
4. **Complete & Earn** — Finish the session to earn XP and see confetti!
5. **Track Progress** — Visit the Profile tab to see your streak, total focus time, and heatmap.
6. **Unlock Buddies** — Level up to unlock new animal companions in the Shop tab.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Pomodoro timer with customizable durations
- [x] XP & level system
- [x] Daily streaks
- [x] Companion unlock system
- [x] Focus heatmap
- [x] Theme support (Warm, Dark, Paper)
- [x] Notifications
- [x] English & Turkish localization
- [ ] Widget support
- [ ] Session history & export
- [ ] More companions & moods
- [ ] Wear OS support

See the [open issues](https://github.com/toprakpt1/Focusbudy/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

FocusBuddy - A privacy-first Pomodoro companion.

Copyright (C) 2026 Toprak Talha Karcılar

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

See the LICENSE file for the full license text.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- PRIVACY -->
## Privacy

FocusBuddy is designed with privacy in mind:

- **Zero network permissions** required for core functionality
- **No analytics, crash trackers, or ads**
- All data is stored **locally** on your device
- Fully functional **offline**

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Toprak Talha Karcılar — [@toprakpt1](https://github.com/toprakpt1)

Project Link: [https://github.com/toprakpt1/Focusbudy](https://github.com/toprakpt1/Focusbudy)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [i18next](https://www.i18next.com)
- [Lucide Icons](https://lucide.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/toprakpt1/Focusbudy.svg?style=for-the-badge
[contributors-url]: https://github.com/toprakpt1/Focusbudy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/toprakpt1/Focusbudy.svg?style=for-the-badge
[forks-url]: https://github.com/toprakpt1/Focusbudy/network/members
[stars-shield]: https://img.shields.io/github/stars/toprakpt1/Focusbudy.svg?style=for-the-badge
[stars-url]: https://github.com/toprakpt1/Focusbudy/stargazers
[issues-shield]: https://img.shields.io/github/issues/toprakpt1/Focusbudy.svg?style=for-the-badge
[issues-url]: https://github.com/toprakpt1/Focusbudy/issues
[license-shield]: https://img.shields.io/github/license/toprakpt1/Focusbudy.svg?style=for-the-badge
[license-url]: https://github.com/toprakpt1/Focusbudy/blob/main/LICENSE
[fdroid-shield]: https://img.shields.io/badge/F--Droid-1976D2?style=for-the-badge&logo=f-droid&logoColor=white
[fdroid-url]: https://f-droid.org/packages/com.focusbuddy.app

[ReactNative-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev/
[Expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Zustand-shield]: https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white
[Zustand-url]: https://github.com/pmndrs/zustand
[i18next-shield]: https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white
[i18next-url]: https://www.i18next.com/
[license-shield]: https://img.shields.io/badge/License-GPLv3-blue.svg
[license-url]: https://www.gnu.org/licenses/gpl-3.0

[screenshot-1]: fastlane/metadata/android/en-US/images/phoneScreenshots/1.jpg
[screenshot-2]: fastlane/metadata/android/en-US/images/phoneScreenshots/2.jpg
[screenshot-3]: fastlane/metadata/android/en-US/images/phoneScreenshots/3.jpg
