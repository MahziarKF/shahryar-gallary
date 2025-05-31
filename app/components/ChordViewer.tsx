interface ChordData {
  name: string;
  frets: (number | null)[];
  fingers?: (number | null)[];
  baseFret?: number;
}

interface ChordViewerProps {
  chord: ChordData;
}

export default function ChordViewer({ chord }: ChordViewerProps) {
  const strings = ["E", "A", "D", "G", "B", "e"];

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl w-fit mx-auto text-center">
      <h2 className="text-xl font-semibold mb-2">{chord.name}</h2>
      <div className="grid grid-cols-6 gap-1 border-l border-b h-40 w-60 relative">
        {chord.frets.map((fret, stringIndex) => {
          if (fret === null) return null;

          return (
            <div
              key={stringIndex}
              className="absolute w-[16.66%] text-center"
              style={{
                left: `${(stringIndex * 100) / 6}%`,
                top: `${(fret - 1) * 25}px`,
              }}
            >
              <div className="w-4 h-4 bg-black rounded-full mx-auto"></div>
            </div>
          );
        })}
        {/* Fret lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="col-span-6 border-t border-gray-300 h-10 w-full"
          ></div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-1 px-1">
        {strings.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}
