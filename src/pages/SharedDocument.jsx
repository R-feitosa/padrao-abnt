import React, { useState, useEffect } from "react";
import { Document } from "@/api/entities";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2 } from "lucide-react";
import ABNTPreview from "../components/editor/ABNTPreview";

export default function SharedDocumentPage() {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    if (!id) {
      setError("Link inválido");
      setIsLoading(false);
      return;
    }

    try {
      const docs = await Document.list();
      const foundDoc = docs.find(d => d.id === id);
      
      if (foundDoc) {
        setDocument(foundDoc);
      } else {
        setError("Documento não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar documento");
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: 'var(--background)'}}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{color: 'var(--primary)'}} />
          <p style={{color: 'var(--text-secondary)'}}>Carregando documento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6" style={{backgroundColor: 'var(--background)'}}>
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
          <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            {error}
          </h2>
          <p style={{color: 'var(--text-secondary)'}}>
            Verifique se o link está correto e tente novamente.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto">
        <Alert className="mb-6" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}>
          <Lock className="h-4 w-4" style={{color: 'var(--primary)'}} />
          <AlertDescription style={{color: 'var(--text-primary)'}}>
            Este documento está em modo somente leitura. Você não pode editá-lo.
          </AlertDescription>
        </Alert>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            {document.title}
          </h1>
          <p style={{color: 'var(--text-secondary)'}}>
            Visualização compartilhada do documento
          </p>
        </div>

        <ABNTPreview 
          structuredData={document.structured_data} 
          documentType={document.document_type}
        />
      </div>
    </div>
  );
}