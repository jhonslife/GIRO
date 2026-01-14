'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCreateFirstAdmin } from '@/hooks/useSetup';
import { useAuthStore } from '@/stores/auth-store';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function FirstAdminWizard() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const createAdmin = useCreateFirstAdmin();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPin(randomPin);
    setConfirmPin(randomPin);
    toast({
      title: 'PIN Gerado',
      description: `PIN: ${randomPin}`,
      duration: 10000,
    });
  };

  const handleNext = () => {
    if (!name || name.length < 3) {
      toast({
        title: 'Nome inválido',
        description: 'Digite um nome com pelo menos 3 caracteres',
        variant: 'destructive',
      });
      return;
    }
    setStep(2);
  };

  const handleCreate = async () => {
    if (pin !== confirmPin) {
      toast({
        title: 'PINs não conferem',
        description: 'Digite o mesmo PIN nos dois campos',
        variant: 'destructive',
      });
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      toast({
        title: 'PIN inválido',
        description: 'O PIN deve ter entre 4 e 6 dígitos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const admin = await createAdmin.mutateAsync({
        name,
        email: email || undefined,
        pin,
      });

      // Auto-login
      login({
        id: admin.id,
        name: admin.name,
        role: 'ADMIN',
        email: admin.email,
        pin,
      });

      toast({
        title: 'Administrador criado!',
        description: 'Você já está logado. Configure seu negócio.',
      });

      navigate('/wizard'); // Wizard de perfil de negócio
    } catch (error) {
      toast({
        title: 'Erro ao criar administrador',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? 'Criar Primeiro Administrador' : 'Escolha um PIN de Acesso'}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {step === 1
              ? 'Você terá acesso total ao sistema'
              : 'Este PIN será usado para fazer login'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo *</label>
                <Input
                  placeholder="Ex: João da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email (opcional)</label>
                <Input
                  type="email"
                  placeholder="Ex: joao@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleNext} disabled={!name || name.length < 3}>
                Próximo →
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">PIN de Acesso (4-6 dígitos) *</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="Digite seu PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirme o PIN *</label>
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="Digite novamente"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>

              <Button variant="outline" className="w-full" onClick={generateRandomPin}>
                🎲 Gerar PIN Aleatório
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={!pin || !confirmPin || pin !== confirmPin || createAdmin.isPending}
                >
                  {createAdmin.isPending ? 'Criando...' : '✅ Criar Administrador'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
