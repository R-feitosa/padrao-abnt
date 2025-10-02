
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createPageUrl } from "@/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function to get status colors based on theme
const getStatusColors = (isDarkMode) => ({
  uploaded: {
    bg: isDarkMode ? "#4c2d00" : "#fef3c7", // Darker yellow for dark mode, original light yellow for light mode
    text: isDarkMode ? "#ffe0b2" : "#92400e", // Lighter text for dark mode, original dark text for light mode
    label: "Enviado"
  },
  processing: {
    bg: isDarkMode ? "#002d4c" : "#dbeafe", // Darker blue for dark mode
    text: isDarkMode ? "#b2e0ff" : "#1e40af", // Lighter text for dark mode
    label: "Processando"
  },
  structured: {
    bg: isDarkMode ? "#2d004c" : "#e0e7ff", // Darker purple for dark mode
    text: isDarkMode ? "#e0b2ff" : "#4338ca", // Lighter text for dark mode
    label: "Estruturado"
  },
  formatted: {
    bg: isDarkMode ? "#004c2d" : "#d1fae5", // Darker green for dark mode
    text: isDarkMode ? "#b2ffd1" : "#065f46", // Lighter text for dark mode
    label: "Formatado"
  },
  exported: {
    bg: isDarkMode ? "#0d3a1f" : "#dcfce7", // Even darker green for dark mode
    text: isDarkMode ? "#b2ffd1" : "#166534", // Lighter text for dark mode
    label: "Exportado"
  }
});

const documentTypeLabels = {
  tcc: "TCC",
  artigo: "Artigo",
  monografia: "Monografia",
  dissertacao: "Dissertação",
  outro: "Outro"
};

export default function MyDocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track dark mode

  useEffect(() => {
    // Detect system theme preference for initial load and changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange); // Listen for changes
    handleChange(); // Set initial value

    loadDocuments();
    return () => mediaQuery.removeEventListener('change', handleChange); // Clean up listener
  }, []);

  const loadDocuments = async () => {
    const docs = await Document.list("-created_date");
    setDocuments(docs);
  };

  const handleDelete = async () => {
    if (documentToDelete) {
      await Document.delete(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      loadDocuments();
    }
  };

  const openDeleteDialog = (doc) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  // Get the theme-aware status colors
  const themeStatusColors = getStatusColors(isDarkMode);

  return (
    <div className="min-h-screen p-6 md:p-12" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
              Meus Documentos
            </h1>
            <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
              Gerencie todos os seus documentos formatados em ABNT
            </p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            size="lg"
            className="text-white hover:opacity-90"
            style={{backgroundColor: 'var(--primary)'}}
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Documento
          </Button>
        </div>

        {documents.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
              Nenhum documento ainda
            </h3>
            <p className="mb-6" style={{color: 'var(--text-secondary)'}}>
              Faça upload do seu primeiro documento para começar
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Home"))}
              className="text-white hover:opacity-90"
              style={{backgroundColor: 'var(--primary)'}}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Documento
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => {
              const statusInfo = themeStatusColors[doc.status] || themeStatusColors.uploaded;
              
              return (
                <Card
                  key={doc.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(createPageUrl(`Editor?id=${doc.id}`))}
                  style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--cream)'}}>
                        <FileText className="w-6 h-6" style={{color: 'var(--primary)'}} />
                      </div>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.text
                        }}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{color: 'var(--text-primary)'}}>
                      {doc.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" style={{borderColor: 'var(--cream-dark)'}}>
                        {documentTypeLabels[doc.document_type]}
                      </Badge>
                    </div>

                    <div className="flex items-center text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(doc.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>

                    <div className="flex gap-2 pt-4 border-t" style={{borderColor: 'var(--border)'}}>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(createPageUrl(`Editor?id=${doc.id}`));
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(doc);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O documento será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
