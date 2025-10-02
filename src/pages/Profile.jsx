
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import PhotoEditor from "../components/profile/PhotoEditor";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false); // New state for editor visibility
  const [tempPhotoUrl, setTempPhotoUrl] = useState(null); // New state for image URL to edit
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    bio: "",
    profile_photo_url: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        bio: currentUser.bio || "",
        profile_photo_url: currentUser.profile_photo_url || ""
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  // Modified handlePhotoUpload to handle photo selection and open editor
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempPhotoUrl(e.target.result);
      setShowPhotoEditor(true);
    };
    reader.readAsDataURL(file);
  };

  // New function to handle saving the cropped photo
  const handlePhotoSave = async (blob) => {
    setIsUploadingPhoto(true);
    setShowPhotoEditor(false); // Close editor after saving starts
    
    try {
      // Convert blob to File object for upload
      const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });
      const { file_url } = await UploadFile({ file });
      
      // Atualiza o formData
      const newFormData = { ...formData, profile_photo_url: file_url };
      setFormData(newFormData);
      
      // Salva automaticamente no banco de dados
      await User.updateMyUserData(newFormData);
      
      // Mostra mensagem de sucesso
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Recarrega os dados do usuário
      loadUserData();
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
    }
    
    setIsUploadingPhoto(false);
    setTempPhotoUrl(null); // Clear temporary URL
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      loadUserData();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{color: 'var(--primary)'}} />
          <p style={{color: 'var(--text-secondary)'}}>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>
            Meu Perfil
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            Gerencie suas informações pessoais
          </p>
        </div>

        {showSuccess && (
          // Fixed Alert colors for dark mode compatibility
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-300" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Perfil atualizado com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white overflow-hidden"
                  style={{backgroundColor: 'var(--primary)'}}
                >
                  {formData.profile_photo_url ? (
                    <img 
                      src={formData.profile_photo_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.full_name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoSelect} // Changed to handlePhotoSelect
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('photo-upload').click()}
                disabled={isUploadingPhoto}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploadingPhoto ? "Enviando..." : "Alterar Foto"}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2" style={{backgroundColor: 'var(--cream)', borderColor: 'var(--cream-dark)'}}>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label>Sobre você</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
              </div>

              <div className="pt-4 border-t" style={{borderColor: 'var(--border)'}}>
                <div className="mb-4">
                  <Label>Função</Label>
                  <div className="mt-1">
                    {user?.role === 'admin' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white'
                      }}>
                        Administrador
                      </span>
                    ) : (
                      // Changed 'Usuário' role badge to use theme-aware classes
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                        Usuário
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Membro desde</Label>
                  <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
                    {new Date(user?.created_date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={loadUserData}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="text-white hover:opacity-90"
            style={{backgroundColor: 'var(--primary)'}}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </div>

      {/* Photo Editor Component */}
      {showPhotoEditor && (
        <PhotoEditor
          imageUrl={tempPhotoUrl}
          onSave={handlePhotoSave}
          onCancel={() => {
            setShowPhotoEditor(false);
            setTempPhotoUrl(null);
          }}
        />
      )}
    </div>
  );
}
