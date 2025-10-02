
import React from "react";
import { Card } from "@/components/ui/card";

export default function ABNTPreview({ structuredData, documentType = "tcc" }) {
  if (!structuredData) return null;

  const formatSecaoTitulo = (titulo, nivel, numeroSecao) => {
    const fontSize = "12pt";
    const marginTop = nivel === 1 ? "36pt" : "24pt";
    const fontWeight = nivel <= 2 ? "bold" : "normal";
    const textTransform = nivel === 1 ? "uppercase" : "none";
    
    return {
      fontSize,
      marginTop,
      fontWeight,
      textTransform,
      marginBottom: "12pt"
    };
  };

  const formatParagrafo = (texto) => {
    if (!texto) return [];
    
    // Remove o marcador ##SUB## mas mantém o texto
    texto = texto.replace(/##SUB##\s*/g, '');
    
    const linhas = texto.split('\n');
    const elementos = [];
    let paragrafoAtual = [];
    
    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i].trim();
      
      if (!linha) {
        // Linha vazia - finaliza parágrafo se houver conteúdo acumulado
        if (paragrafoAtual.length > 0) {
          elementos.push({
            type: 'normal',
            texto: paragrafoAtual.join(' '),
            key: elementos.length
          });
          paragrafoAtual = [];
        }
        continue;
      }
      
      // Detecta fórmula matemática
      if (linha.includes('###FORMULA###')) {
        if (paragrafoAtual.length > 0) {
          elementos.push({
            type: 'normal',
            texto: paragrafoAtual.join(' '),
            key: elementos.length
          });
          paragrafoAtual = [];
        }
        
        const match = linha.match(/###FORMULA###(.+?)###\/FORMULA###/);
        if (match) {
          elementos.push({
            type: 'formula',
            texto: match[1].trim(),
            key: elementos.length
          });
        }
        
        // Continua com o resto do texto da linha se houver
        const resto = linha.replace(/###FORMULA###.+?###\/FORMULA###/, '').trim();
        if (resto) {
          paragrafoAtual.push(resto);
        }
        continue;
      }
      
      // Detecta imagem
      if (linha.includes('###IMG###')) {
        if (paragrafoAtual.length > 0) {
          elementos.push({
            type: 'normal',
            texto: paragrafoAtual.join(' '),
            key: elementos.length
          });
          paragrafoAtual = [];
        }
        
        const match = linha.match(/###IMG###(.+?)###\/IMG###/);
        if (match) {
          elementos.push({
            type: 'imagem',
            texto: match[1].trim(),
            key: elementos.length
          });
        }
        continue;
      }
      
      // Detecta citação longa
      if (linha.includes('###CIT###')) {
        if (paragrafoAtual.length > 0) {
          elementos.push({
            type: 'normal',
            texto: paragrafoAtual.join(' '),
            key: elementos.length
          });
          paragrafoAtual = [];
        }
        
        const match = linha.match(/###CIT###(.+?)###\/CIT###/);
        if (match) {
          elementos.push({
            type: 'citacao-longa',
            texto: match[1].trim(),
            key: elementos.length
          });
        }
        continue;
      }
      
      // Detecta subtítulo numerado (ex: 2.1 Título, 2.1. Título, 2.2.1 Título)
      // Deve começar com números e pontos, seguido de espaço e texto
      if (linha.match(/^\d+(\.\d+)*\.?\s+[A-Z]/)) {
        // Finaliza parágrafo anterior se existir
        if (paragrafoAtual.length > 0) {
          elementos.push({
            type: 'normal',
            texto: paragrafoAtual.join(' '),
            key: elementos.length
          });
          paragrafoAtual = [];
        }
        
        // Separa o subtítulo do possível texto que vem depois
        const partes = linha.split(/(?<=^\d+(?:\.\d+)*\.?\s+[^.]+\.)\s+/);
        
        if (partes.length > 1) {
          // Tem texto após o subtítulo na mesma linha
          elementos.push({
            type: 'subtitulo',
            texto: partes[0].trim(),
            key: elementos.length
          });
          // O resto vira parágrafo
          paragrafoAtual.push(partes.slice(1).join(' ').trim());
        } else {
          // Subtítulo sozinho na linha
          elementos.push({
            type: 'subtitulo',
            texto: linha,
            key: elementos.length
          });
        }
        continue;
      }
      
      // Linha com conteúdo - adiciona ao parágrafo atual
      paragrafoAtual.push(linha);
    }
    
    // Salva último parágrafo se houver
    if (paragrafoAtual.length > 0) {
      elementos.push({
        type: 'normal',
        texto: paragrafoAtual.join(' '),
        key: elementos.length
      });
    }
    
    return elementos;
  };

  const renderParagrafo = (item) => {
    switch (item.type) {
      case 'formula':
        return (
          <div key={item.key} style={{ 
            textAlign: "center", 
            marginTop: "18pt", 
            marginBottom: "18pt",
            fontFamily: "Courier New, monospace",
            fontSize: "11pt",
            fontWeight: "bold",
          }}>
            {item.texto}
          </div>
        );
      
      case 'imagem':
        return (
          <div key={item.key} style={{ 
            textAlign: "center", 
            marginTop: "18pt", 
            marginBottom: "18pt"
          }}>
            <div style={{
              border: "1px solid #ddd",
              padding: "20pt",
              backgroundColor: "#f9f9f9",
              fontStyle: "italic",
              fontSize: "10pt",
            }}>
              {item.texto}
            </div>
            <p style={{ 
              fontSize: "10pt", 
              marginTop: "6pt",
              fontStyle: "italic",
              textIndent: "0",
            }}>
              Fonte: O autor (2024)
            </p>
          </div>
        );
      
      case 'subtitulo':
        return (
          <h4 key={item.key} style={{
            fontSize: "12pt",
            fontWeight: "bold",
            textTransform: "none",
            textAlign: "left",
            marginTop: "12pt", // Changed from 18pt
            marginBottom: "6pt", // Changed from 12pt
            textIndent: "0",
            lineHeight: "1.5",
          }}>
            {item.texto}
          </h4>
        );
      
      case 'citacao-longa':
        return (
          <div key={item.key} className="citacao-longa">
            {item.texto}
          </div>
        );
      
      default:
        return (
          <p key={item.key} style={{ 
            textAlign: "justify", 
            textIndent: "1.25cm", 
            marginBottom: "12pt", 
            lineHeight: "1.5",
            fontWeight: "normal",
          }}>
            {item.texto}
          </p>
        );
    }
  };

  let pageCounter = 0;
  // totalDesenvolvimento is still used if other calculations depend on it, 
  // but for Conclusion heading itself, the number is removed as per request.
  const totalDesenvolvimento = structuredData.desenvolvimento?.length || 0; 

  const documentTypeLabels = {
    tcc: "TRABALHO DE CONCLUSÃO DE CURSO",
    artigo: "ARTIGO CIENTÍFICO",
    monografia: "MONOGRAFIA",
    dissertacao: "DISSERTAÇÃO DE MESTRADO",
    tese: "TESE DE DOUTORADO", // Added this based on common document types
    outro: "TRABALHO ACADÊMICO"
  };

  return (
    <Card className="p-0 shadow-lg overflow-hidden" style={{backgroundColor: 'var(--surface)'}}>
      <style>{`
        @page {
          size: A4;
          margin: 3cm 2cm 2cm 3cm;
        }
        
        .abnt-page {
          width: 21cm;
          min-height: 29.7cm;
          padding: 3cm 2cm 2cm 3cm;
          margin: 0 auto 20px auto;
          background-color: var(--surface);
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          position: relative;
          page-break-after: always;
        }
        
        .abnt-page:last-child {
          page-break-after: auto;
        }
        
        .page-number {
          position: absolute;
          top: 2cm;
          right: 2cm;
          font-size: 10pt;
          font-family: 'Times New Roman', Times, serif;
          color: var(--text-primary);
        }
        
        .citacao-longa {
          margin-left: 4cm;
          margin-right: 0;
          font-size: 10pt;
          line-height: 1.0;
          text-align: justify;
          margin-top: 12pt;
          margin-bottom: 12pt;
          color: var(--text-primary);
        }
        
        .abnt-document {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: var(--text-primary);
        }
        
        .abnt-document h2,
        .abnt-document h3,
        .abnt-document h4,
        .abnt-document p {
          color: var(--text-primary);
        }
        
        @media print {
          @page {
            size: A4;
            margin: 3cm 2cm 2cm 3cm;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .abnt-page {
            box-shadow: none;
            margin: 0;
            padding: 3cm 2cm 2cm 3cm;
            page-break-after: always;
            background-color: white !important;
          }
          
          .abnt-page:last-child {
            page-break-after: auto;
          }
          
          .page-number {
            display: block;
            color: black !important;
          }
          
          .abnt-document,
          .abnt-document h2,
          .abnt-document h3,
          .abnt-document h4,
          .abnt-document p,
          .citacao-longa {
            color: black !important;
          }
        }
      `}</style>
      
      <div className="abnt-preview">
        {/* Capa */}
        {structuredData.capa && (
          <div className="abnt-page">
            <div className="abnt-document" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "calc(29.7cm - 5cm)" }}>
              <div style={{ textAlign: "center", marginTop: "0" }}>
                <p style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0", lineHeight: "1.5" }}>
                  {structuredData.capa.instituicao}
                </p>
                <p style={{ fontSize: "12pt", marginTop: "6pt", marginBottom: "0", lineHeight: "1.5" }}>
                  {structuredData.capa.curso}
                </p>
              </div>
              
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.5", textAlign: "center" }}>
                  {structuredData.capa.autor}
                </p>
              </div>
              
              <div style={{ textAlign: "center", marginBottom: "auto" }}>
                <p style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6pt", lineHeight: "1.5" }}>
                  {structuredData.capa.titulo}
                </p>
                {structuredData.capa.subtitulo && (
                  <p style={{ fontSize: "12pt", marginTop: "6pt", lineHeight: "1.5" }}>
                    {structuredData.capa.subtitulo}
                  </p>
                )}
                <p style={{ fontSize: "10pt", marginTop: "24pt", lineHeight: "1.5", fontStyle: "italic" }}>
                  {documentTypeLabels[documentType] || documentTypeLabels["outro"]}
                </p>
              </div>
              
              <div style={{ textAlign: "center", marginTop: "auto" }}>
                <p style={{ fontSize: "12pt", marginBottom: "6pt", lineHeight: "1.5" }}>
                  {structuredData.capa.cidade}
                </p>
                <p style={{ fontSize: "12pt", lineHeight: "1.5" }}>
                  {structuredData.capa.ano}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resumo */}
        {structuredData.resumo?.texto && (
          <div className="abnt-page">
            <div className="abnt-document">
              <div style={{ textAlign: "center", width: "100%", marginBottom: "24pt" }}>
                <h2 style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "0" }}>
                  RESUMO
                </h2>
              </div>
              <p style={{ textAlign: "justify", textIndent: "0", marginBottom: "24pt", lineHeight: "1.5" }}>
                {structuredData.resumo.texto}
              </p>
              {structuredData.resumo.palavras_chave && structuredData.resumo.palavras_chave.length > 0 && (
                <p style={{ textAlign: "justify", textIndent: "0", lineHeight: "1.5" }}>
                  <strong>Palavras-chave:</strong> {structuredData.resumo.palavras_chave.filter(p => p).join(". ")}.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Abstract */}
        {structuredData.abstract?.texto && (
          <div className="abnt-page">
            <div className="abnt-document">
              <div style={{ textAlign: "center", width: "100%", marginBottom: "24pt" }}>
                <h2 style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "0" }}>
                  ABSTRACT
                </h2>
              </div>
              <p style={{ textAlign: "justify", textIndent: "0", marginBottom: "24pt", lineHeight: "1.5" }}>
                {structuredData.abstract.texto}
              </p>
              {structuredData.abstract.keywords && structuredData.abstract.keywords.length > 0 && (
                <p style={{ textAlign: "justify", textIndent: "0", lineHeight: "1.5" }}>
                  <strong>Keywords:</strong> {structuredData.abstract.keywords.filter(k => k).join(". ")}.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Introdução (começa numeração) */}
        {structuredData.introducao && (
          <div className="abnt-page">
            <span className="page-number">{++pageCounter}</span>
            <div className="abnt-document">
              <h2 style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", marginBottom: "24pt", marginTop: "0", textAlign: "left" }}>
                1 INTRODUÇÃO
              </h2>
              {formatParagrafo(structuredData.introducao).map(renderParagrafo)}
            </div>
          </div>
        )}

        {/* Desenvolvimento */}
        {structuredData.desenvolvimento && structuredData.desenvolvimento.map((secao, index) => (
          <div key={index} className="abnt-page">
            <span className="page-number">{++pageCounter}</span>
            <div className="abnt-document">
              <h3 style={{
                fontSize: "12pt",
                fontWeight: "bold",
                textTransform: secao.nivel === 1 ? "uppercase" : "none",
                marginBottom: "24pt",
                marginTop: "0",
                textAlign: "left",
              }}>
                {secao.titulo}
              </h3>
              {formatParagrafo(secao.conteudo).map(renderParagrafo)}
            </div>
          </div>
        ))}

        {/* Conclusão */}
        {structuredData.conclusao && (
          <div className="abnt-page">
            <span className="page-number">{++pageCounter}</span>
            <div className="abnt-document">
              <h2 style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", marginBottom: "24pt", marginTop: "0", textAlign: "left" }}>
                CONCLUSÃO
              </h2>
              {formatParagrafo(structuredData.conclusao).map(renderParagrafo)}
            </div>
          </div>
        )}

        {/* Referências */}
        {structuredData.referencias && structuredData.referencias.length > 0 && (
          <div className="abnt-page">
            <span className="page-number">{++pageCounter}</span>
            <div className="abnt-document">
              <div style={{ textAlign: "center", width: "100%", marginBottom: "24pt" }}>
                <h2 style={{ fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "0" }}>
                  REFERÊNCIAS
                </h2>
              </div>
              <div style={{ textAlign: "left", lineHeight: "1.5" }}>
                {structuredData.referencias
                  .filter(ref => ref)
                  .sort((a, b) => a.localeCompare(b))
                  .map((referencia, idx) => (
                    <p key={idx} style={{ marginBottom: "12pt", textIndent: "0" }}>
                      {referencia}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
