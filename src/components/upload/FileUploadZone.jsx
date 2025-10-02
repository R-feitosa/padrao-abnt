
import React, { useRef, useState } from "react";
import { Upload, File, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileUploadZone({ onFileSelect, isProcessing, uploadedFile }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        dragActive ? 'shadow-lg' : 'hover:border-gray-400'
      }`}
      style={{
        borderColor: dragActive ? 'var(--primary)' : 'var(--border-color)', // Changed from var(--cream-dark)
        backgroundColor: 'var(--background-secondary)' // Changed from var(--cream)
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,.txt"
        onChange={handleChange}
        className="hidden"
      />

      {!uploadedFile && !isProcessing && (
        <>
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: 'var(--background-secondary)'}}> {/* Changed from var(--cream) */}
            <Upload className="w-10 h-10" style={{color: 'var(--primary)'}} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            Arraste seu documento aqui
          </h3>
          <p className="mb-6" style={{color: 'var(--text-secondary)'}}>
            ou clique para selecionar um arquivo
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-6 text-lg font-medium text-white hover:opacity-90"
            style={{backgroundColor: 'var(--primary)'}}
          >
            Selecionar Arquivo
          </Button>
          <p className="text-sm mt-4" style={{color: 'var(--text-secondary)'}}>
            Formatos aceitos: Word (.docx), PDF, Texto (.txt)
          </p>
        </>
      )}

      {isProcessing && (
        <div className="py-8">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{color: 'var(--primary)'}} />
          <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            Processando documento...
          </h3>
          <p style={{color: 'var(--text-secondary)'}}>
            Extraindo e analisando a estrutura do texto
          </p>
        </div>
      )}

      {uploadedFile && !isProcessing && (
        <div className="py-8">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--primary)'}} />
          <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            Arquivo enviado com sucesso!
          </h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <File className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>{uploadedFile.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
