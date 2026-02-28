interface StartScreenProps {
  onStart: () => void;
}

const bootLines = [
  { prefix: '[BOOT] ', text: 'SOC_OPS v2.1.0' },
  { prefix: '[INIT] ', text: 'Loading social protocols...' },
  { prefix: '[OK]   ', text: '24 prompts loaded' },
  { prefix: '[OK]   ', text: '5x5 grid initialized' },
  { prefix: '[OK]   ', text: 'Free space allocated' },
  { prefix: '[READY]', text: 'System online' },
];

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-terminal-bg animate-[screenOn_0.6s_ease-out]">
      <div className="text-center max-w-sm animate-[flicker_4s_infinite]">
        <h1 className="font-terminal-heading text-5xl text-terminal-green mb-1 [text-shadow:0_0_10px_#33ff00,0_0_30px_#33ff0044]">
          SOC_OPS<span className="animate-[blink_1s_step-end_infinite]">_</span>
        </h1>
        <p className="text-lg text-terminal-dim mb-6 font-terminal-heading tracking-wide">// social bingo terminal</p>

        <div className="border border-terminal-dim bg-terminal-surface p-5 mb-8 text-left">
          {bootLines.map((line, i) => (
            <div
              key={line.text}
              className="font-terminal text-lg animate-[fadeInLine_0.3s_ease-out_both]"
              style={{ animationDelay: `${i * 250}ms` }}
            >
              <span className="text-terminal-dim">{line.prefix}</span>{' '}
              <span className="text-terminal-green">{line.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full bg-terminal-green text-terminal-bg font-terminal-heading py-4 px-8 text-xl tracking-widest transition-all duration-150 active:bg-accent-light hover:[box-shadow:0_0_20px_#33ff00,0_0_40px_#33ff0033] animate-[fadeInLine_0.3s_ease-out_both] [text-shadow:0_0_8px_#0a0a0a]"
          style={{ animationDelay: `${bootLines.length * 250}ms` }}
        >
          &gt; START_GAME
        </button>
      </div>
    </div>
  );
}
