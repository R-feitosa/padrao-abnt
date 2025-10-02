
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import Logo from "../components/Logo";

import DocumentTypeSelector from "../components/upload/DocumentTypeSelector";
import FileUploadZone from "../components/upload/FileUploadZone";

export default function HomePage() {
  const navigate = useNavigate();
  const [documentType, setDocumentType] = useState("tcc");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    setError(null);
    setUploadedFile(file);
  };

  const processDocument = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { file_url } = await UploadFile({ file: uploadedFile });

      // Ao invés de extrair o conteúdo primeiro, envia o arquivo diretamente para o LLM
      const structuredData = await InvokeLLM({
        prompt: `Analise o documento acadêmico em anexo e estruture conforme as normas ABNT.

INSTRUÇÕES CRUCIAIS DE FORMATAÇÃO AUTOMÁTICA:

1. SUBTÍTULOS NUMERADOS (ex: 2.1, 2.2.1, 3.1.2):
   - Identifique TODOS os subtítulos numerados no formato X.Y, X.Y.Z, etc.
   - Adicione "##SUB## " antes do subtítulo (exemplo: "##SUB## 2.1 Metodologia Aplicada")
   - IMPORTANTE: Preserve a numeração completa e o título

2. FÓRMULAS MATEMÁTICAS:
   - Identifique TODAS as equações, fórmulas e expressões matemáticas
   - Coloque entre ###FORMULA### e ###/FORMULA### 
   - Exemplo: "###FORMULA###E=mc²###/FORMULA###"
   - Exemplo: "###FORMULA###Attention(Q,K,V)=softmax(QK^T/√d_k)V###/FORMULA###"

3. IMAGENS (se houver):
   - Se o documento mencionar figuras/imagens, marque com "###IMG###descrição da imagem###/IMG###"
   - Exemplo: "###IMG###Figura 1 - Arquitetura do modelo###/IMG###"

4. CITAÇÕES LONGAS (mais de 3 linhas):
   - Identifique citações diretas longas no texto
   - Adicione "###CIT### " no início e " ###/CIT###" no fim

ESTRUTURA A RETORNAR:
{
  "capa": {
    "instituicao": "string (extrair do documento)",
    "curso": "string (extrair do documento)", 
    "autor": "string (extrair do documento)",
    "titulo": "string (extrair do documento)",
    "subtitulo": "string (extrair do documento se houver)",
    "cidade": "string (extrair do documento)",
    "ano": "string (extrair do documento)"
  },
  "resumo": {
    "texto": "string (extrair o resumo completo)",
    "palavras_chave": ["array de strings"]
  },
  "abstract": {
    "texto": "string (se existir no documento)",
    "keywords": ["array de strings (se existir)"]
  },
  "introducao": "string (texto completo COM os marcadores ##SUB##, ###FORMULA###, ###IMG###, ###CIT### já aplicados)",
  "desenvolvimento": [
    {
      "titulo": "string (ex: Fundamentos da Arquitetura Transformer)",
      "nivel": "number (1 para seção principal, 2 para subseção, etc)",
      "conteudo": "string (COM marcadores já aplicados)"
    }
  ],
  "conclusao": "string (COM marcadores já aplicados)",
  "referencias": ["array de strings, cada referência completa"]
}

APLIQUE OS MARCADORES DIRETAMENTE NO CONTEÚDO DE CADA SEÇÃO.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            capa: {
              type: "object",
              properties: {
                instituicao: { type: "string" },
                curso: { type: "string" },
                autor: { type: "string" },
                titulo: { type: "string" },
                subtitulo: { type: "string" },
                cidade: { type: "string" },
                ano: { type: "string" }
              }
            },
            resumo: {
              type: "object",
              properties: {
                texto: { type: "string" },
                palavras_chave: { type: "array", items: { type: "string" } }
              }
            },
            abstract: {
              type: "object",
              properties: {
                texto: { type: "string" },
                keywords: { type: "array", items: { type: "string" } }
              }
            },
            introducao: { type: "string" },
            desenvolvimento: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  nivel: { type: "number" },
                  conteudo: { type: "string" }
                }
              }
            },
            conclusao: { type: "string" },
            referencias: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const document = await Document.create({
        title: structuredData.capa?.titulo || uploadedFile.name,
        document_type: documentType,
        original_file_url: file_url,
        status: "structured",
        extracted_content: "", // Extracted content is no longer explicitly stored here as it's processed directly by LLM
        structured_data: structuredData
      });

      navigate(createPageUrl(`Editor?id=${document.id}`));
    } catch (err) {
      console.error("Erro ao processar documento:", err);
      setError("Erro ao processar o documento. Tente com um arquivo menor ou em formato diferente.");
      setIsProcessing(false);
    }
  };

  return (
    // Changed: Used Tailwind's bg-background for theme-aware background
    <div className="min-h-screen p-6 md:p-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          {/* Changed: Used Tailwind's text-foreground for theme-aware primary text color */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Padrão ABNT
          </h1>
          {/* Changed: Used Tailwind's text-muted-foreground for theme-aware secondary text color */}
          <p className="text-lg md:text-xl text-muted-foreground">
            Upload, análise automática e formatação profissional em minutos
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          <div>
            {/* Changed: Used Tailwind's text-foreground */}
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              1. Selecione o tipo de documento
            </h2>
            <DocumentTypeSelector
              selectedType={documentType}
              onSelectType={setDocumentType}
            />
          </div>

          <div>
            {/* Changed: Used Tailwind's text-foreground */}
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              2. Faça upload do seu arquivo
            </h2>
            <FileUploadZone
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
              uploadedFile={uploadedFile}
            />
          </div>

          {uploadedFile && !isProcessing && (
            <div className="flex justify-center">
              <Button
                onClick={processDocument}
                size="lg"
                // Changed: Replaced inline style with bg-primary and text-white with text-primary-foreground
                // text-primary-foreground adapts its color based on the bg-primary, ensuring contrast in light/dark mode
                className="px-12 py-6 text-lg font-medium bg-primary text-primary-foreground hover:opacity-90"
              >
                Processar e Formatar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* Changed: Replaced style with bg-muted for a theme-aware background that adapts to dark mode */}
          <div className="text-center p-6 rounded-lg bg-muted">
            {/* Changed: Replaced style with bg-primary and text-white with text-primary-foreground */}
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl bg-primary text-primary-foreground">
              1
            </div>
            {/* Changed: Used Tailwind's text-foreground */}
            <h3 className="font-bold mb-2 text-foreground">Upload rápido</h3>
            {/* Changed: Used Tailwind's text-muted-foreground */}
            <p className="text-sm text-muted-foreground">
              Arraste e solte seu documento Word, PDF ou TXT
            </p>
          </div>
          {/* Changed: Replaced style with bg-muted */}
          <div className="text-center p-6 rounded-lg bg-muted">
            {/* Changed: Replaced style with bg-primary and text-white with text-primary-foreground */}
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl bg-primary text-primary-foreground">
              2
            </div>
            {/* Changed: Used Tailwind's text-foreground */}
            <h3 className="font-bold mb-2 text-foreground">Análise inteligente</h3>
            {/* Changed: Used Tailwind's text-muted-foreground */}
            <p className="text-sm text-muted-foreground">
              Sistema identifica automaticamente a estrutura do texto
            </p>
          </div>
          {/* Changed: Replaced style with bg-muted */}
          <div className="text-center p-6 rounded-lg bg-muted">
            {/* Changed: Replaced style with bg-primary and text-white with text-primary-foreground */}
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl bg-primary text-primary-foreground">
              3
            </div>
            {/* Changed: Used Tailwind's text-foreground */}
            <h3 className="font-bold mb-2 text-foreground">Formatação ABNT</h3>
            {/* Changed: Used Tailwind's text-muted-foreground */}
            <p className="text-sm text-muted-foreground">
              Documento formatado seguindo todas as normas ABNT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
