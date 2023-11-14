# Projects Lab

Projects Lab is a monorepo that houses a collection of diverse projects, each utilizing various technologies. The repository is structured into workspaces, including `apps` for front-end applications, `services` for backend applications, and `packages` for shared code.

## Goal

The primary goal of Projects Lab is to provide a centralized space for managing and developing a range of projects. The monorepo structure streamlines collaboration, encourages code reuse, and simplifies the overall maintenance of related applications.

## Technologies Used

- **Turbo Repo:** The monorepo is managed using Turbo Repo, a tool that simplifies the development workflow, handles dependencies, and optimizes build processes within a monorepo architecture.

- **Docker:** Projects Lab leverages Docker for containerization, ensuring consistent development and deployment environments across different projects.

- **Next.js:** For building modern and optimized web applications with React.

- **Node.js:** For server-side JavaScript, used in the backend services.

## Table of Contents

- [Apps](#apps)
  - [Ouija](#ouija)
- [Packages](#packages)
  - [eslint-config](#eslint-config)
  - [helpers](#helpers)
  - [icons](#icons)
  - [next-pwa](#next-pwa)
  - [prettier-config](#prettier-config)
  - [typescript-config](#typescript-config)
  - [ui](#ui)
- [Services](#services)
  - [Audio Encoder](#audio-encoder)

## Apps

### Ouija

Ouija is a fascinating Next.js application designed to provide users with a unique digital Ouija board experience. Leveraging the power of Chat GPT and Whisper, Ouija offers a modern and interactive way for users to simulate the traditional spirit communication tool in a digital environment. Key features include:

- **Multiple Entities** Users can enhance their experience by interacting with multiple entities during a session. This feature adds an extra layer of depth and unpredictability to the virtual Ouija board, providing a dynamic and engaging encounter.
- **Interactive Palette** The application features an interactive palette that moves in response to the words associated with the entities. This interactive palette adds a visually stimulating element to the experience, creating a dynamic and responsive environment for users.
- **Integration with Whisper:** For an added layer of immersion, Ouija integrates with OpenAI's Whisper, utilizing advanced speech-to-text capabilities for a more interactive and dynamic communication experience.


## Services

### Audio Encoder

The `Audio Encoder` service is a powerful Node.js application designed to utilize OpenAI Whisper for encoding audio data through speech-to-text conversion. Key features and details include:

- **Whisper Integration:** The service seamlessly integrates with OpenAI Whisper, a state-of-the-art automatic speech recognition (ASR) system, to accurately transcribe audio data into text.
- **Node.js Backend:** Built on Node.js, the service provides a scalable and efficient backend for processing audio data, making it suitable for a wide range of applications, from transcription services to voice command recognition.
- **Asynchronous Processing:** The service supports asynchronous processing, allowing for the efficient handling of large audio files or concurrent requests without impacting performance.
- **API Documentation:** Comprehensive documentation is available for developers, outlining the API endpoints, request and response formats, and integration guidelines, facilitating easy integration into diverse projects within the monorepo.


## Packages

### eslint-config

The `eslint-config` package provides a standardized set of ESLint configurations that can be easily shared and extended across various projects within the monorepo. Key features and details include:

- **Consistent Code Style:** The package enforces a consistent code style across the entire monorepo, enhancing readability and maintainability.
- **Extensibility:** Developers can extend and customize the ESLint configurations based on specific project requirements while still benefiting from the shared foundation provided by `eslint-config`.

### helpers

The `helpers` package serves as a centralized repository for shared utilities and helper functions that can be utilized across different projects within the monorepo. Key features include:

- **Code Reusability:** Developers can easily access and reuse common utility functions, reducing redundancy and promoting a more efficient development process.
- **Documentation:** The package includes comprehensive documentation outlining the available utility functions, their purposes, and usage examples, facilitating seamless integration into various projects.

### icons

The `icons` package leverages Material UI icons to provide a consistent and aesthetically pleasing set of icons for use across different applications within the monorepo. Key features include:

- **Material Design Integration:** The package seamlessly integrates Material Design principles, offering a unified and visually appealing iconography that aligns with modern design standards.
- **Customization:** Developers can easily customize the size, color, and style of icons to suit the visual requirements of their specific projects.

### next-pwa

The `next-pwa` package enhances Next.js applications with Progressive Web App (PWA) capabilities, leveraging Workbox for service workers and offline support. Key features and details include:

- **Offline Functionality:** With the integration of Workbox, Next.js applications using `next-pwa` can provide offline functionality, allowing users to access content even without an active internet connection.
- **Caching Strategies:** Developers can configure caching strategies to optimize performance, ensuring that frequently accessed resources are available locally, reducing load times and enhancing the overall user experience.

### prettier-config

The `prettier-config` package defines a standardized Prettier configuration that ensures consistent code formatting across all projects within the monorepo. Key features include:

- **Automatic Code Formatting:** Developers benefit from automatic code formatting, maintaining a consistent style and improving code readability.
- **Integration with ESLint:** The package is seamlessly integrated with ESLint, providing a unified code formatting and linting solution for enhanced code quality.

### typescript-config

The `typescript-config` package provides a standardized TypeScript configuration that can be shared and extended across different projects within the monorepo. Key features include:

- **Strict Type Checking:** The package enforces strict TypeScript type checking, enhancing code robustness and reducing runtime errors.
- **Configuration Extensibility:** Developers can easily extend and customize TypeScript configurations based on project-specific requirements while still adhering to the shared foundation provided by `typescript-config`.

### ui

The `ui` package leverages Material UI to offer a consistent and visually appealing set of user interface components for front-end applications within the monorepo. Key features include:

- **React Component Library:** The package provides a collection of pre-designed React components following Material Design principles, reducing the need for repetitive UI development tasks.
- **Theming Support:** Developers can easily customize and theme UI components to align with the visual identity of their specific applications, ensuring a cohesive and branded user experience.
