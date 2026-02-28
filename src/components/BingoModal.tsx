interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-terminal-surface border border-terminal-green p-6 max-w-xs w-full text-center shadow-[0_0_40px_#33ff00,0_0_80px_#33ff0022] animate-[typeIn_0.4s_ease-out]">
        <div className="text-terminal-green font-terminal text-2xl mb-3 tracking-widest animate-[flicker_3s_infinite] [text-shadow:0_0_10px_#33ff00]">*** BINGO ***</div>
        <h2 className="text-4xl font-terminal-heading text-bingo mb-2 [text-shadow:0_0_15px_#ffcc00,0_0_30px_#ffcc0044]">BINGO!</h2>
        <p className="text-terminal-dim mb-6 font-terminal text-lg">// line complete</p>
        
        <button
          onClick={onDismiss}
          className="w-full bg-terminal-green text-terminal-bg font-terminal-heading py-3 px-6 text-lg tracking-widest transition-all duration-150 active:bg-accent-light hover:[box-shadow:0_0_20px_#33ff00,0_0_40px_#33ff0033]"
        >
          &gt; CONTINUE
        </button>
      </div>
    </div>
  );
}
