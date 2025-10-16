import { useState } from 'react';

interface InputPanelProps {
    onInputChange: (text: string) => void;
    onFileImport: (file: File) => void;
}

export default function InputPanel({ onInputChange, onFileImport }: InputPanelProps) {
    const [inputText, setInputText] = useState(`# 节点部分
A, B, C, D, E

# 依赖关系部分
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
                <h2 className="text-lg font-semibold text-gray-800">输入</h2>
                <div className="flex gap-2">
                    <label className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 cursor-pointer transition-colors">
                        导入文件
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
                        清空
                    </button>
                </div>
            </div>

            <textarea
                value={inputText}
                onChange={handleTextChange}
                className="flex-1 w-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="在此输入依赖关系图...&#10;&#10;格式：&#10;# 节点部分&#10;A, B, C&#10;&#10;# 依赖关系部分&#10;A -> B&#10;B -> C"
            />

            <div className="mt-3 text-xs text-gray-500">
                <p className="font-medium mb-1">格式说明：</p>
                <p>• 节点：用逗号分隔的列表</p>
                <p>• 依赖关系：使用 "A -&gt; B" 格式</p>
                <p>• 注释：以 # 开头</p>
            </div>
        </div>
    );
}
