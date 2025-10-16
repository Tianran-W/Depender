import { useState, useEffect } from 'react';

interface InputPanelProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onFileImport: (file: File) => void;
}

export default function InputPanel({ inputText, onInputChange, onFileImport }: InputPanelProps) {
  const [localInputText, setLocalInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Sync with parent's inputText when it changes (e.g., from file import)
  useEffect(() => {
    if (inputText !== localInputText) {
      setLocalInputText(inputText);
    }
  }, [inputText, localInputText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalInputText(text);
    onInputChange(text);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileImport(file);
    }
  };

  const handleClear = () => {
    setLocalInputText('');
    onInputChange('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files.find(f =>
      f.name.endsWith('.yaml') ||
      f.name.endsWith('.yml') ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.dep')
    );

    if (file) {
      onFileImport(file);
    }
  };

  return (
    <div
      className="relative flex flex-col h-full bg-white rounded-lg shadow-md p-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-50 bg-opacity-90 border-2 border-dashed border-indigo-400 rounded-lg flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-semibold text-indigo-600">拖放文件到这里</p>
            <p className="text-sm text-indigo-500 mt-1">支持 .yaml, .yml, .txt, .dep 格式</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">{/*  */}
        <h2 className="text-lg font-semibold text-gray-800">输入</h2>
        <div className="flex gap-2">
          <label className="px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 cursor-pointer transition-colors">
            导入文件
            <input
              type="file"
              accept=".txt,.dep,.yaml,.yml"
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
        value={localInputText}
        onChange={handleTextChange}
        className="flex-1 w-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder={`在此输入依赖关系图，或拖拽文件到此区域...

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
