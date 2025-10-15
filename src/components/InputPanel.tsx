import { useState } from 'react';

interface InputPanelProps {
    onInputChange: (text: string) => void;
    onFileImport: (file: File) => void;
}

export default function InputPanel({ onInputChange, onFileImport }: InputPanelProps) {
    const [inputText, setInputText] = useState(`# Nodes Section
A, B, C, D, E

# Dependencies Section
A -> B
A -> C
B -> D
C -> D
D -> E`);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        onInputChange(text);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileImport(file);
        }
    };

    const handleClear = () => {
        setInputText('');
        onInputChange('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Input</h2>
                <div className="flex gap-2">
                    <label className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 cursor-pointer transition-colors">
                        Import File
                        <input
                            type="file"
                            accept=".txt,.dep"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <textarea
                value={inputText}
                onChange={handleTextChange}
                className="flex-1 w-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your dependency graph here...&#10;&#10;Format:&#10;# Nodes Section&#10;A, B, C&#10;&#10;# Dependencies Section&#10;A -> B&#10;B -> C"
            />

            <div className="mt-3 text-xs text-gray-500">
                <p className="font-medium mb-1">Format Guide:</p>
                <p>• Nodes: Comma-separated list</p>
                <p>• Dependencies: Use "A -&gt; B" format</p>
                <p>• Comments: Start line with #</p>
            </div>
        </div>
    );
}
