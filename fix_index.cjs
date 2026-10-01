const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const errScript = `
    <script>
      window.onerror = function(msg, url, line, col, error) {
        var err = document.createElement('div');
        err.style.position = 'fixed';
        err.style.top = '0';
        err.style.left = '0';
        err.style.width = '100%';
        err.style.background = 'red';
        err.style.color = 'white';
        err.style.zIndex = '999999';
        err.style.padding = '20px';
        err.style.fontFamily = 'monospace';
        err.innerText = "Error: " + msg + "\\nLine: " + line;
        document.body.appendChild(err);
      };
      window.onunhandledrejection = function(e) {
        var err = document.createElement('div');
        err.style.position = 'fixed';
        err.style.top = '0';
        err.style.left = '0';
        err.style.width = '100%';
        err.style.background = 'orange';
        err.style.color = 'white';
        err.style.zIndex = '999999';
        err.style.padding = '20px';
        err.style.fontFamily = 'monospace';
        err.innerText = "Promise Error: " + (e.reason ? e.reason.message || e.reason : "Unknown");
        document.body.appendChild(err);
      };
    </script>
`;

if (!code.includes('window.onerror')) {
  code = code.replace('<body>', '<body>' + errScript);
  fs.writeFileSync('index.html', code);
}
