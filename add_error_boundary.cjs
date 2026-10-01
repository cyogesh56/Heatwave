const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const boundary = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', background: 'white' }}>
          <h2>Something went wrong in ControllerView.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

// Insert the ErrorBoundary class after imports
cv = cv.replace(/import { motion, AnimatePresence } from 'framer-motion';/, "import { motion, AnimatePresence } from 'framer-motion';\n" + boundary);

// Wrap the main return block
cv = cv.replace(/return \(\n    <div className="relative w-full h-\[100dvh\] bg-canvas/, "return (\n    <ErrorBoundary>\n    <div className=\"relative w-full h-[100dvh] bg-canvas");
cv = cv.replace(/<\/div>\n  \);\n\};\n?$/, "    </div>\n    </ErrorBoundary>\n  );\n};\n");

fs.writeFileSync('src/views/ControllerView.tsx', cv);
