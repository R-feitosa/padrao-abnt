import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TableOfContents({ structuredData }) {
  const generateTOC = () => {
    const items = [];
    let currentPage = 1;

    // Resumo e Abstract não são numerados e aparecem antes da introdução
    if (structuredData.resumo?.texto) {
      items.push({
        title: "RESUMO",
        page: null,
        level: 0,
        numbered: false
      });
    }

    if (structuredData.abstract?.texto) {
      items.push({
        title: "ABSTRACT",
        page: null,
        level: 0,
        numbered: false
      });
    }

    // Introdução (página 1)
    if (structuredData.introducao) {
      items.push({
        title: "1 INTRODUÇÃO",
        page: currentPage++,
        level: 0,
        numbered: true
      });
    }

    // Desenvolvimento
    if (structuredData.desenvolvimento) {
      structuredData.desenvolvimento.forEach((secao, index) => {
        items.push({
          title: secao.titulo,
          page: currentPage++,
          level: secao.nivel || 1,
          numbered: true
        });
      });
    }

    // Conclusão
    if (structuredData.conclusao) {
      items.push({
        title: "CONCLUSÃO",
        page: currentPage++,
        level: 0,
        numbered: true
      });
    }

    // Referências
    if (structuredData.referencias && structuredData.referencias.length > 0) {
      items.push({
        title: "REFERÊNCIAS",
        page: currentPage,
        level: 0,
        numbered: false
      });
    }

    return items;
  };

  const tocItems = generateTOC();

  return (
    <Card>
      <CardHeader>
        <CardTitle>SUMÁRIO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 font-serif">
          {tocItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start py-1"
              style={{
                paddingLeft: `${item.level * 20}px`,
                fontWeight: item.level === 0 ? 'bold' : 'normal',
                textTransform: item.level === 0 ? 'uppercase' : 'none'
              }}
            >
              <span className="flex-1" style={{color: 'var(--text-primary)'}}>
                {item.title}
              </span>
              {item.page && (
                <span className="ml-4" style={{color: 'var(--text-secondary)'}}>
                  {item.page}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}