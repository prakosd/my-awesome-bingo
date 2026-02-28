interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-terminal-bg animate-[screenOn_0.6s_ease-out]">
      <div className="text-center max-w-sm animate-[flicker_4s_infinite]">
        <h1 className="font-terminal-heading text-5xl text-terminal-green mb-1 [text-shadow:0_0_10px_#33ff00,0_0_30px_#33ff0044]">
          SOC_OPS<span className="animate-[blink_1s_step-end_infinite]">_</span>
        </h1>
        <p className="text-lg text-terminal-dim mb-10 font-terminal-heading tracking-wide">// social bingo terminal</p>
        
        <div className="border border-terminal-dim bg-terminal-surface p-5 mb-10 text-left">
          <h2 className="text-terminal-green font-terminal-heading mb-3 text-sm tracking-wider">README.TXT</h2>
          <ul className="text-terminal-dim text-lg space-y-2 font-terminal">
            <li>&gt; Find people who match the prompts</li>
            <li>&gt; Tap a square when you find a match</li>
            <li>&gt; Complete 5 in a row to win</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-terminal-green text-terminal-bg font-terminal-heading py-4 px-8 text-xl tracking-widest transition-all duration-150 active:bg-accent-light hover:[box-shadow:0_0_20px_#33ff00,0_0_40px_#33ff0033]"
        >
          &gt; START_GAME
        </button>
      </div>
    </div>
  );
}
