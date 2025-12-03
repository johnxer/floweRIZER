# 🌿 Flower Organizer

A modern, feature-rich application for managing your indoor garden. Keep track of your plants, their watering schedules, and organize them by rooms. Built with Vue 3, Firebase, and AI-powered features.

## ✨ Features

-   **🏠 Room Management**: Organize your plants into virtual rooms. Create, edit, and delete rooms to match your home layout.
-   **🌱 Plant Tracking**:
    -   Detailed plant profiles with photos, names, and descriptions.
    -   **💧 Watering Schedules**: Track watering frequency and get visual indicators when plants need water.
    -   **🤖 AI-Powered Recognition**: Upload a photo and let Google Gemini AI automatically identify your plant and fill in the details.
    -   **📜 History Logs**: Keep a journal for each plant with custom notes and progress photos.
-   **🖱️ Drag & Drop Interface**: Easily move plants between rooms or reorder them using intuitive drag-and-drop.
-   **📊 Dashboard**: Get a quick overview of your entire collection and statistics.
-   **🌗 Dark Mode**: Fully supported dark theme for a comfortable viewing experience.
-   **📱 Responsive Design**: Works seamlessly on desktop and mobile devices.
-   **🔐 Secure Authentication**: User accounts managed via Firebase Authentication.

## 🛠️ Tech Stack

-   **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Sass
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
-   **AI Integration**: [Google Generative AI SDK](https://ai.google.dev/) (Gemini)
-   **UI Components**:
    -   [Headless UI](https://headlessui.com/)
    -   [Floating Vue](https://floating-vue.starpad.dev/)
    -   [Reka UI](https://reka-ui.com/)
-   **Forms & Validation**: [Vee-Validate](https://vee-validate.logaretm.com/) & [Zod](https://zod.dev/)
-   **Utilities**: [VueUse](https://vueuse.org/), [date-fns](https://date-fns.org/), [VueDraggable](https://github.com/SortableJS/vue.draggable.next)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16+ recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/flower-organizer.git
    cd flower-organizer
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup** Create a `.env` file in the root directory and add your Firebase and Google AI configuration:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run Development Server**

    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Vue components
│   ├── base/        # Generic UI components (Buttons, Modals, Inputs)
│   ├── features/    # Feature-specific components (Plants, Rooms, Auth)
│   ├── layout/      # Layout components (Header, Sidebar)
│   ├── stats/       # Dashboard statistics components
│   └── ui/          # Reusable UI primitives
├── composables/     # Shared logic (Hooks)
├── pages/           # Application views/routes
├── router/          # Vue Router configuration
├── stores/          # Pinia state stores
└── utils/           # Helper functions
```

## 📄 License

This project is licensed under the MIT License.
