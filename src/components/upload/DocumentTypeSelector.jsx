
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, BookOpen, GraduationCap, ScrollText } from "lucide-react";

const documentTypes = [
  {
    type: "tcc",
    title: "TCC",
    description: "Trabalho de Conclusão de Curso",
    icon: GraduationCap,
  },
  {
    type: "artigo",
    title: "Artigo",
    description: "Artigo científico ou acadêmico",
    icon: FileText,
  },
  {
    type: "monografia",
    title: "Monografia",
    description: "Monografia de especialização",
    icon: BookOpen,
  },
  {
    type: "dissertacao",
    title: "Dissertação",
    description: "Dissertação de mestrado",
    icon: ScrollText,
  },
];

export default function DocumentTypeSelector({ selectedType, onSelectType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {documentTypes.map((docType) => {
        const Icon = docType.icon;
        const isSelected = selectedType === docType.type;
        
        return (
          <Card
            key={docType.type}
            onClick={() => onSelectType(docType.type)}
            // Replaced inline 'style' properties for borders and background with Tailwind classes
            // Assumes Tailwind config is set up with 'primary', 'border', 'muted', 'foreground', 'primary-foreground' colors
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg 
              ${isSelected 
                ? 'border-2 border-primary shadow-md' // Apply primary border for selected state
                : 'border border-border hover:border-muted-foreground' // Apply default border and a muted-foreground hover effect
              }
            `}
            // Removed the 'style' prop as all styling is now handled by className
          >
            <div className="text-center">
              {/* Replaced inline 'style' for background with Tailwind classes */}
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 
                ${isSelected ? 'bg-primary' : 'bg-muted'} // Use bg-primary for selected, bg-muted for unselected
              `}>
                {/* Replaced inline 'style' for icon color with Tailwind classes */}
                <Icon className={`w-7 h-7 
                  ${isSelected ? 'text-primary-foreground' : 'text-primary'} // Icon color: text-primary-foreground on primary bg, text-primary otherwise
                `} />
              </div>
              {/* Replaced inline 'style' for h3 color with Tailwind class */}
              <h3 className="font-bold text-lg mb-1 text-foreground">{docType.title}</h3> {/* Use text-foreground */}
              {/* Replaced inline 'style' for p color with Tailwind class */}
              <p className="text-sm text-muted-foreground">{docType.description}</p> {/* Use text-muted-foreground */}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
