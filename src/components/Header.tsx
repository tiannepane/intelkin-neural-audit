const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 border-b border-border">
    <div className="flex items-center gap-2">
      <span className="text-foreground font-semibold text-lg tracking-tight">Intelkin</span>
      <span className="text-muted-foreground text-xs font-mono ml-1">/ neural audit</span>
    </div>
    <div />
    <span className="text-muted-foreground text-xs font-mono">
      Powered by TRIBE v2 · Meta FAIR
    </span>
  </header>
);

export default Header;
