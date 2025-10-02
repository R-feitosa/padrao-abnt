import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Hash, Clock, FileDigit } from "lucide-react";

export default function DocumentStats({ structuredData }) {
  const calculateStats = () => {
    let totalWords = 0;
    let totalCharacters = 0;
    let totalPages = 0;

    // Contar palavras e caracteres de todas as seções
    const sections = [
      structuredData.resumo?.texto,
      structuredData.abstract?.texto,
      structuredData.introducao,
      structuredData.conclusao,
      ...(structuredData.desenvolvimento || []).map(s => s.conteudo)
    ].filter(Boolean);

    sections.forEach(text => {
      const words = text.trim().split(/\s+/).filter(w => w.length > 0);
      totalWords += words.length;
      totalCharacters += text.length;
    });

    // Estimativa de páginas (aproximadamente 250 palavras por página)
    totalPages = Math.ceil(totalWords / 250);

    // Tempo estimado de leitura (200 palavras por minuto)
    const readingTime = Math.ceil(totalWords / 200);

    return {
      words: totalWords,
      characters: totalCharacters,
      pages: totalPages,
      readingTime
    };
  };

  const stats = calculateStats();

  const statItems = [
    {
      icon: Hash,
      label: "Palavras",
      value: stats.words.toLocaleString('pt-BR'),
      color: "var(--primary)"
    },
    {
      icon: FileText,
      label: "Caracteres",
      value: stats.characters.toLocaleString('pt-BR'),
      color: "#2563eb"
    },
    {
      icon: FileDigit,
      label: "Páginas estimadas",
      value: stats.pages,
      color: "#8b5cf6"
    },
    {
      icon: Clock,
      label: "Tempo de leitura",
      value: `${stats.readingTime} min`,
      color: "#059669"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas do Documento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center p-4 rounded-lg" style={{backgroundColor: 'var(--cream)'}}>
                <Icon className="w-8 h-8 mx-auto mb-2" style={{color: item.color}} />
                <div className="text-2xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>
                  {item.value}
                </div>
                <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}