
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function StructureEditor({ structuredData, onChange }) {
  const updateCapa = (field, value) => {
    onChange({
      ...structuredData,
      capa: {
        ...structuredData.capa,
        [field]: value
      }
    });
  };

  const updateResumo = (field, value) => {
    onChange({
      ...structuredData,
      resumo: {
        ...structuredData.resumo,
        [field]: value
      }
    });
  };

  const addPalavraChave = () => {
    onChange({
      ...structuredData,
      resumo: {
        ...structuredData.resumo,
        palavras_chave: [...(structuredData.resumo?.palavras_chave || []), ""]
      }
    });
  };

  const updatePalavraChave = (index, value) => {
    const palavras = [...(structuredData.resumo?.palavras_chave || [])];
    palavras[index] = value;
    updateResumo("palavras_chave", palavras);
  };

  const removePalavraChave = (index) => {
    const palavras = (structuredData.resumo?.palavras_chave || []).filter((_, i) => i !== index);
    updateResumo("palavras_chave", palavras);
  };

  const addSecao = () => {
    onChange({
      ...structuredData,
      desenvolvimento: [
        ...(structuredData.desenvolvimento || []),
        { titulo: "", nivel: 1, conteudo: "" }
      ]
    });
  };

  const updateSecao = (index, field, value) => {
    const secoes = [...(structuredData.desenvolvimento || [])];
    secoes[index] = { ...secoes[index], [field]: value };
    onChange({ ...structuredData, desenvolvimento: secoes });
  };

  const removeSecao = (index) => {
    const secoes = (structuredData.desenvolvimento || []).filter((_, i) => i !== index);
    onChange({ ...structuredData, desenvolvimento: secoes });
  };

  const moveSecao = (index, direction) => {
    const secoes = [...(structuredData.desenvolvimento || [])];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < secoes.length) {
      [secoes[index], secoes[newIndex]] = [secoes[newIndex], secoes[index]];
      onChange({ ...structuredData, desenvolvimento: secoes });
    }
  };

  const addReferencia = () => {
    onChange({
      ...structuredData,
      referencias: [...(structuredData.referencias || []), ""]
    });
  };

  const updateReferencia = (index, value) => {
    const refs = [...(structuredData.referencias || [])];
    refs[index] = value;
    onChange({ ...structuredData, referencias: refs });
  };

  const removeReferencia = (index) => {
    const refs = (structuredData.referencias || []).filter((_, i) => i !== index);
    onChange({ ...structuredData, referencias: refs });
  };

  return (
    <div className="space-y-6">
      <Alert style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}>
        <Info className="h-4 w-4" style={{color: 'var(--primary)'}} />
        <AlertDescription style={{color: 'var(--text-primary)'}}>
          <strong>Formatação automática aplicada:</strong> O sistema detectou automaticamente subtítulos numerados (2.1, 2.2.1), fórmulas matemáticas, imagens e citações longas do seu documento. A formatação ABNT será aplicada na visualização.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Capa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Instituição</Label>
            <Input
              value={structuredData.capa?.instituicao || ""}
              onChange={(e) => updateCapa("instituicao", e.target.value)}
              placeholder="Nome da instituição"
            />
          </div>
          <div>
            <Label>Curso</Label>
            <Input
              value={structuredData.capa?.curso || ""}
              onChange={(e) => updateCapa("curso", e.target.value)}
              placeholder="Nome do curso"
            />
          </div>
          <div>
            <Label>Autor</Label>
            <Input
              value={structuredData.capa?.autor || ""}
              onChange={(e) => updateCapa("autor", e.target.value)}
              placeholder="Nome completo do autor"
            />
          </div>
          <div>
            <Label>Título</Label>
            <Input
              value={structuredData.capa?.titulo || ""}
              onChange={(e) => updateCapa("titulo", e.target.value)}
              placeholder="Título do trabalho"
            />
          </div>
          <div>
            <Label>Subtítulo (opcional)</Label>
            <Input
              value={structuredData.capa?.subtitulo || ""}
              onChange={(e) => updateCapa("subtitulo", e.target.value)}
              placeholder="Subtítulo do trabalho"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cidade</Label>
              <Input
                value={structuredData.capa?.cidade || ""}
                onChange={(e) => updateCapa("cidade", e.target.value)}
                placeholder="Cidade"
              />
            </div>
            <div>
              <Label>Ano</Label>
              <Input
                value={structuredData.capa?.ano || ""}
                onChange={(e) => updateCapa("ano", e.target.value)}
                placeholder="Ano"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Texto do Resumo</Label>
            <Textarea
              value={structuredData.resumo?.texto || ""}
              onChange={(e) => updateResumo("texto", e.target.value)}
              placeholder="Digite o resumo do trabalho"
              rows={6}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Palavras-chave</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPalavraChave}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {(structuredData.resumo?.palavras_chave || []).map((palavra, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={palavra}
                    onChange={(e) => updatePalavraChave(index, e.target.value)}
                    placeholder="Palavra-chave"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePalavraChave(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Introdução</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={structuredData.introducao || ""}
            onChange={(e) => onChange({ ...structuredData, introducao: e.target.value })}
            placeholder="Digite a introdução"
            rows={8}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Desenvolvimento</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSecao}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Seção
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(structuredData.desenvolvimento || []).map((secao, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={secao.titulo}
                    onChange={(e) => updateSecao(index, "titulo", e.target.value)}
                    placeholder="Título da seção"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={secao.nivel}
                    onChange={(e) => updateSecao(index, "nivel", parseInt(e.target.value))}
                    placeholder="Nível"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSecao(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSecao(index, "down")}
                    disabled={index === (structuredData.desenvolvimento || []).length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSecao(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={secao.conteudo}
                onChange={(e) => updateSecao(index, "conteudo", e.target.value)}
                placeholder="Conteúdo da seção"
                rows={6}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={structuredData.conclusao || ""}
            onChange={(e) => onChange({ ...structuredData, conclusao: e.target.value })}
            placeholder="Digite a conclusão"
            rows={8}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Referências</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReferencia}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Referência
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}>
            <Info className="h-4 w-4" style={{color: 'var(--primary)'}} />
            <AlertDescription style={{color: 'var(--text-primary)'}}>
              Digite cada referência completa conforme NBR 6023. As referências serão ordenadas alfabeticamente automaticamente.
            </AlertDescription>
          </Alert>
          {(structuredData.referencias || []).map((ref, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={ref}
                onChange={(e) => updateReferencia(index, e.target.value)}
                placeholder="Digite a referência completa (ex: SOBRENOME, Nome. Título. Cidade: Editora, Ano.)"
                rows={2}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeReferencia(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
