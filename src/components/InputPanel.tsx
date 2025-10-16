import { useState } from 'react';

interface InputPanelProps {
    onInputChange: (text: string) => void;
    onFileImport: (file: File) => void;
}

export default function InputPanel({ onInputChange, onFileImport }: InputPanelProps) {
    const [inputText, setInputText] = useState(`nodes:
  - id: "1"
    title: "任务A"
    description: "第一个任务"
  - id: "2"
    title: "任务B"
    description: "依赖于A的任务"
    dependencies:
      - "1"
  - id: "3"
    title: "任务C"
    description: "依赖于A的任务"
    dependencies:
      - "1"
  - id: "4"
    title: "任务D"
    description: "依赖于B和C的任务"
    dependencies:
      - "2"
      - "3"
  - id: "5"
    title: "任务E"
    description: "最后的任务"
    dependencies:
      - "4"`);

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
                placeholder={`在此输入依赖关系图...

YAML 格式：
nodes:
  - id: "1"
    title: "节点A"
    description: "描述"
  - id: "2"
    title: "节点B"
    dependencies:
      - "1"`}
            />

            <div className="mt-3 text-xs text-gray-500">
                <p className="font-medium mb-1">YAML 格式说明：</p>
                <p>• nodes: 声明所有节点</p>
                <p className="ml-3">- id: 节点唯一标识（必需）</p>
                <p className="ml-3">- title: 节点标题（必需）</p>
                <p className="ml-3">- description: 节点描述（可选）</p>
                <p className="ml-3">- dependencies: 依赖的前置节点ID列表（可选）</p>
            </div>
        </div>
    );
}
