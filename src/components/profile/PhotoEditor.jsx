import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

export default function PhotoEditor({ imageUrl, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState(null);

  const drawImage = (img, zoomLevel, rot, pos) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    ctx.translate(size / 2, size / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(pos.x, pos.y);

    const scale = Math.max(size / img.width, size / img.height);
    const width = img.width * scale;
    const height = img.height * scale;

    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();

    // Draw circular mask
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      drawImage(img, zoom, rotation, position);
    };
    img.src = imageUrl;
  }, [imageUrl, zoom, rotation, position]);

  useEffect(() => {
    if (image) {
      drawImage(image, zoom, rotation, position);
    }
  }, [zoom, rotation, position, image]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      onSave(blob);
    }, "image/jpeg", 0.95);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajustar Foto de Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div
              className="relative border-2 rounded-full overflow-hidden cursor-move"
              style={{ width: 400, height: 400, borderColor: 'var(--primary)' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Zoom</label>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
                  <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <ZoomIn className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
                </div>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleRotate}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Rotacionar 90°
              </Button>
            </div>
          </div>

          <div className="text-sm text-center" style={{color: 'var(--text-secondary)'}}>
            Arraste a imagem para reposicionar
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="text-white hover:opacity-90"
            style={{backgroundColor: 'var(--primary)'}}
          >
            Salvar Foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}