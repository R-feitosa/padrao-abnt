
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, FileDown, Eye, Share2, BarChart3, FileCheck2, List } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import StructureEditor from "../components/editor/StructureEditor";
import ABNTPreview from "../components/editor/ABNTPreview";
import DocumentStats from "../components/editor/DocumentStats";
import FormatChecker from "../components/editor/FormatChecker";
import TableOfContents from "../components/editor/TableOfContents";
import { exportWord } from "@/api/functions";

export default function EditorPage() {
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [structuredData, setStructuredData] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isExportingWord, setIsExportingWord] = useState(false);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    if (id) {
      const doc = await Document.list();
      const foundDoc = doc.find(d => d.id === id);
      if (foundDoc) {
        setDocument(foundDoc);
        setStructuredData(foundDoc.structured_data || {});
      }
    }
  };

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      await Document.update(document.id, {
        structured_data: structuredData,
        status: "formatted"
      });
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
    setIsSaving(false);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Muda para a aba de preview antes de imprimir
    if (activeTab !== "preview") {
      setActiveTab("preview");
      // Aguarda um momento para a página renderizar completamente
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Adiciona classe especial para impressão
    window.document.body.classList.add('printing-abnt');
    
    // Dispara a impressão
    window.print();
    
    // Remove a classe após a impressão
    setTimeout(() => {
      window.document.body.classList.remove('printing-abnt');
      setIsExporting(false);
    }, 1000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${createPageUrl(`SharedDocument?id=${document.id}`)}`;
    setShareUrl(url);
    setShowShareDialog(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowSaveSuccess(true); // Reusing save success message for copy success
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    try {
      const response = await exportWord({
        structuredData,
        documentTitle: document.title
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Erro ao exportar Word:", error);
    }
    setIsExportingWord(false);
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: 'var(--primary)'}}></div>
          <p style={{color: 'var(--text-secondary)'}}>Carregando documento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("MyDocuments"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold" style={{color: 'var(--text-primary)'}}>
                {document.title}
              </h1>
              <p style={{color: 'var(--text-secondary)'}}>
                Editar e visualizar documento formatado
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportWord}
              disabled={isExportingWord}
            >
              <FileDown className="w-4 h-4 mr-2" />
              {isExportingWord ? "Exportando..." : "Exportar Word"}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="text-white hover:opacity-90"
              style={{backgroundColor: 'var(--primary)'}}
            >
              <FileDown className="w-4 h-4 mr-2" />
              {isExporting ? "Preparando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>

        {showSaveSuccess && (
          <Alert className="mb-6" style={{backgroundColor: '#f0fdf4', borderColor: '#86efac'}}>
            <CheckCircle2 className="h-4 w-4" style={{color: '#16a34a'}} />
            <AlertDescription style={{color: '#16a34a'}}>
              Documento salvo com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="checker">
              <FileCheck2 className="w-4 h-4 mr-2" />
              Verificação
            </TabsTrigger>
            <TabsTrigger value="toc">
              <List className="w-4 h-4 mr-2" />
              Sumário
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Visualização ABNT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <StructureEditor
              structuredData={structuredData}
              onChange={setStructuredData}
            />
          </TabsContent>

          <TabsContent value="stats">
            <DocumentStats structuredData={structuredData} />
          </TabsContent>

          <TabsContent value="checker">
            <FormatChecker structuredData={structuredData} />
          </TabsContent>

          <TabsContent value="toc">
            <TableOfContents structuredData={structuredData} />
          </TabsContent>

          <TabsContent value="preview">
            <ABNTPreview 
              structuredData={structuredData} 
              documentType={document.document_type}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Documento</DialogTitle>
            <DialogDescription>
              Copie o link abaixo para compartilhar seu documento (apenas visualização)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyShareLink}>
                Copiar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 3cm 2cm 2cm 3cm;
          }
          
          body.printing-abnt * {
            visibility: hidden;
          }
          
          body.printing-abnt .abnt-preview,
          body.printing-abnt .abnt-preview * {
            visibility: visible;
          }
          
          body.printing-abnt .abnt-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
