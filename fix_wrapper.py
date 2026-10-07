with open('src/views/HostView.tsx', 'r') as f:
    c = f.read()

# Make the current HostView an inner component
c = c.replace('export const HostView: React.FC = () => {', 'const HostViewInner: React.FC = () => {')

# Add the wrapper at the bottom
c += """

export const HostView: React.FC = () => {
  return (
    <ErrorBoundary>
      <HostViewInner />
    </ErrorBoundary>
  );
};
"""

with open('src/views/HostView.tsx', 'w') as f:
    f.write(c)
