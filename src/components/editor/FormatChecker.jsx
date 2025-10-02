import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function FormatChecker({ structuredData }) {
  const checkFormatting = () => {
    const issues = [];
    const warnings = [];
    const successes = [];

    // Verifica capa
    if (!structuredData.capa?.instituicao) issues.push("Instituição não preenchida na capa");
    if (!structuredData.capa?.autor) issues.push("Autor não preenchido na capa");
    if (!structuredData.capa?.titulo) issues.push("Título não preenchido na capa");
    if (!structuredData.capa?.cidade) warnings.push("Cidade não preenchida na capa");
    if (!structuredData.capa?.ano) warnings.push("Ano não preenchido na capa");
    else successes.push("Capa completa");

    // Verifica resumo
    if (!structuredData.resumo?.texto) issues.push("Resumo não preenchido");
    else if (structuredData.resumo.texto.split(/\s+/).length < 150) warnings.push("Resumo muito curto (mínimo 150 palavras recomendado)");
    else if (structuredData.resumo.texto.split(/\s+/).length > 500) warnings.push("Resumo muito longo (máximo 500 palavras recomendado)");
    else successes.push("Resumo com tamanho adequado");

    if (!structuredData.resumo?.palavras_chave || structuredData.resumo.palavras_chave.length < 3) 
      warnings.push("Mínimo de 3 palavras-chave recomendado");
    else successes.push("Palavras-chave adequadas");

    // Verifica introdução
    if (!structuredData.introducao) issues.push("Introdução não preenchida");
    else successes.push("Introdução presente");

    // Verifica desenvolvimento
    if (!structuredData.desenvolvimento || structuredData.desenvolvimento.length === 0) 
      issues.push("Desenvolvimento não possui seções");
    else successes.push(`${structuredData.desenvolvimento.length} seções no desenvolvimento`);

    // Verifica conclusão
    if (!structuredData.conclusao) issues.push("Conclusão não preenchida");
    else successes.push("Conclusão presente");

    // Verifica referências
    if (!structuredData.referencias || structuredData.referencias.length === 0) 
      issues.push("Nenhuma referência adicionada");
    else if (structuredData.referencias.length < 5) 
      warnings.push("Poucas referências (mínimo 5 recomendado para TCC)");
    else successes.push(`${structuredData.referencias.length} referências cadastradas`);

    return { issues, warnings, successes };
  };

  const { issues, warnings, successes } = checkFormatting();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificador de Formatação ABNT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2" style={{color: '#dc2626'}}>
              <XCircle className="w-5 h-5" />
              Problemas Críticos ({issues.length})
            </h4>
            {issues.map((issue, index) => (
              <Alert key={index} style={{backgroundColor: '#fef2f2', borderColor: '#fecaca'}}>
                <AlertDescription style={{color: '#991b1b'}}>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2" style={{color: '#ea580c'}}>
              <AlertTriangle className="w-5 h-5" />
              Avisos ({warnings.length})
            </h4>
            {warnings.map((warning, index) => (
              <Alert key={index} style={{backgroundColor: '#fff7ed', borderColor: '#fed7aa'}}>
                <AlertDescription style={{color: '#9a3412'}}>{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {successes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2" style={{color: '#16a34a'}}>
              <CheckCircle2 className="w-5 h-5" />
              Itens Corretos ({successes.length})
            </h4>
            {successes.map((success, index) => (
              <Alert key={index} style={{backgroundColor: '#f0fdf4', borderColor: '#86efac'}}>
                <AlertDescription style={{color: '#166534'}}>{success}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}