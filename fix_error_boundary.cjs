const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const boundary = `
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', background: 'white', zIndex: 99999, position: 'relative' }}>
          <h2>Something went wrong in ControllerView.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

cv = cv.replace(/class ErrorBoundary extends React\.Component \{[\s\S]*?\}\n\}/, boundary.trim());
fs.writeFileSync('src/views/ControllerView.tsx', cv);
