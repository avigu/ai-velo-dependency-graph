# 🤖 AI-Powered Velo Dependency Graph Visualizer

A modern React application that uses OpenAI's GPT models to intelligently analyze Velo by Wix code and generate interactive dependency graphs. Perfect for understanding complex codebases, visualizing function relationships, and identifying architectural patterns.

![AI Dependency Graph](https://img.shields.io/badge/AI-Powered-brightgreen) ![React](https://img.shields.io/badge/React-18.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue) ![React Flow](https://img.shields.io/badge/React%20Flow-Interactive-purple)

## ✨ Features

- **🤖 AI-Powered Analysis**: Leverages OpenAI's GPT models to intelligently parse Velo code
- **📊 Interactive Visualizations**: Beautiful, interactive dependency graphs using React Flow
- **🎯 Smart Grouping**: Automatically groups functions by type (Page Functions, Event Handlers, Wix APIs, etc.)
- **🔍 Detailed Tooltips**: Hover over nodes to see function descriptions and details
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Analysis**: Fast processing with detailed logging and error handling
- **🎨 Modern UI**: Clean, professional interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key (get one at [openai.com](https://openai.com/api/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-velo-dependency-graph.git
   cd ai-velo-dependency-graph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key** (optional but recommended)
   ```bash
   # Create a .env file in the root directory
   echo "REACT_APP_OPENAI_API_KEY=your_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser** to `http://localhost:3000`

## 📖 How to Use

1. **Enter your OpenAI API key** (if not set in .env file)
2. **Upload a Velo code file** or paste your code directly into the text area
3. **Click "Analyze with AI"** to process your code
4. **Explore the generated graph**:
   - Hover over nodes for detailed information
   - Use the mini-map for navigation
   - Toggle the analysis panel for insights
   - View the raw AI response for debugging

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AICodeInput.tsx          # Code input and API key management
│   ├── AIDependencyGraph.tsx    # Main graph visualization component
│   └── AIFunctionTooltip.tsx    # Interactive tooltips for nodes
├── utils/
│   ├── aiParser.ts              # OpenAI integration and code analysis
│   └── aiGraphUtils.ts          # Graph layout and visualization utilities
├── App.tsx                      # Main application component
└── index.tsx                    # Application entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### Supported File Types

- `.js` - JavaScript files
- `.jsx` - React JavaScript files  
- `.ts` - TypeScript files
- `.tsx` - React TypeScript files
- `.jsw` - Velo backend files

## 🎨 Node Types & Grouping

The AI automatically categorizes code elements into visual groups:

| Type | Icon | Description |
|------|------|-------------|
| Page Functions | ⚙️ | Frontend page logic and lifecycle functions |
| Event Handlers | ⚡ | User interaction and event handling |
| Backend Functions | 🌐 | Server-side functions and API calls |
| Wix APIs | 🔌 | Wix platform integrations |
| Page Elements | 📱 | UI elements and components |
| Utilities | 🔧 | Helper functions and utilities |
| Errors | ❌ | Analysis errors or unknown elements |

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Visualization**: React Flow for interactive graphs
- **AI Integration**: OpenAI GPT-4o-mini
- **Styling**: CSS-in-JS with responsive design
- **Build Tool**: Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI models
- [React Flow](https://reactflow.dev/) for the graph visualization library
- [Wix](https://www.wix.com/) for the Velo development platform

## 📞 Support

- 🐛 [Report bugs](https://github.com/yourusername/ai-velo-dependency-graph/issues)
- 💡 [Request features](https://github.com/yourusername/ai-velo-dependency-graph/issues)
- 📖 [Documentation](https://github.com/yourusername/ai-velo-dependency-graph/wiki)

---

Made with ❤️ and 🤖 AI
