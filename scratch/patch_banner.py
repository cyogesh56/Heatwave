import re

with open("src/views/ControllerView.tsx", "r") as f:
    c_content = f.read()

banner_ui = """
      {!hideHeader && disconnectedPlayers.length > 0 && (
        <div className="w-full bg-accent-dare text-canvas font-meta font-bold text-xs uppercase tracking-widest py-2 px-4 text-center animate-pulse">
           {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected
        </div>
      )}
"""

# Insert right after <UniversalHeader ... />
c_content = re.sub(r'(<UniversalHeader[^>]*/>)', r'\1' + banner_ui, c_content)

with open("src/views/ControllerView.tsx", "w") as f:
    f.write(c_content)


with open("src/views/HostView.tsx", "r") as f:
    h_content = f.read()

h_banner_ui = """
      {disconnectedPlayers.length > 0 && (
        <div className="w-full bg-accent-dare text-canvas font-meta font-bold text-xs uppercase tracking-widest py-2 px-4 text-center animate-pulse relative z-[99999]">
           {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected
        </div>
      )}
"""

h_content = re.sub(r'(<UniversalHeader[^>]*/>)', r'\1' + h_banner_ui, h_content)

with open("src/views/HostView.tsx", "w") as f:
    f.write(h_content)

