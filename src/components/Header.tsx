import { Pill, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-medical flex items-center justify-center shadow-soft">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Hospital at Home
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-Powered Medicine Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Your health companion</span>
        </div>
      </div>
    </header>
  );
}
