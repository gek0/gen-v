# Gen-V (Gemini AI Vibe coding showcase)

A modern web application designed for rapid development and deployment, featuring a robust frontend, containerized infrastructure, and flexible configuration.

---

## 🚀 Features

- **React Frontend**: Built with TypeScript and React for a seamless user experience.
- **Containerized Deployment**: Ready-to-use Docker and Nginx configurations.
- **Easy Build & Run**: Simple scripts for development and production.
- **Configurable**: Environment-based configuration for different deployments.

---

## 📂 Project Structure

```
gen-v/
  ├── build_config/      # Nginx and build configs
  ├── public/            # Static assets and index.html
  ├── src/               # React source code
  ├── Dockerfile         # Container build file
  ├── package.json       # Node dependencies and scripts
  ├── tsconfig.json      # TypeScript configuration
  └── README.md          # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for containerization)

### Installation

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Run the development server**
   ```sh
   npm start
   ```

3. **Build for production**
   ```sh
   npm run build
   ```

---

## 🐳 Docker Usage

Build and run the containerized app:

```sh
docker build -t gen-v .
docker run -p 80:80 gen-v
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

*For questions or support, open an issue in this repository.*