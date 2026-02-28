interface ScavengerCompleteModalProps {
  target: number;
  onDismiss: () => void;
}

export function ScavengerCompleteModal({ target, onDismiss }: ScavengerCompleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div
        className="border border-terminal-green bg-terminal-bg p-8 text-center"
        style={{ animation: 'typeIn 0.4s ease-out both' }}
      >
        <p className="font-terminal text-terminal-dim text-lg tracking-widest">*** HUNT_COMPLETE ***</p>
        <h2
          className="font-terminal-heading text-bingo text-4xl mt-3"
          style={{ textShadow: '0 0 20px #ffcc00' }}
        >
          FIRST {target} FOUND!
        </h2>
        <p className="font-terminal text-terminal-dim text-sm mt-2">// mission accomplished</p>
        <button
          className="bg-terminal-green text-terminal-bg font-terminal-heading px-6 py-2 mt-6 hover:shadow-[0_0_20px_#33ff00] transition-shadow cursor-pointer"
          onClick={onDismiss}
        >
          &gt; CONTINUE
        </button>
      </div>
    </div>
  );
}
