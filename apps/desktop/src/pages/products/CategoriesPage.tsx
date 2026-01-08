/**
 * @file CategoriesPage - Gerenciamento de categorias
 * @description Listagem e edição de categorias de produtos
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORY_COLORS, useCategories, useCreateCategory } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import { ArrowLeft, Edit, FolderTree, Plus, Trash2 } from 'lucide-react';
import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export const CategoriesPage: FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]!.value);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    await createCategory.mutateAsync({
      name: newCategoryName,
      color: selectedColor,
    });

    setNewCategoryName('');
    setSelectedColor(CATEGORY_COLORS[0]!.value);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Organize seus produtos em categorias</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para organizar seus produtos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  placeholder="Ex: Bebidas"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={cn(
                        'h-8 w-8 rounded-full transition-transform hover:scale-110',
                        selectedColor === color.value && 'ring-2 ring-ring ring-offset-2'
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!newCategoryName.trim()}>
                Criar Categoria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-20 rounded bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full">
            <Card className="flex flex-col items-center justify-center py-12">
              <FolderTree className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma categoria</h3>
              <p className="text-sm text-muted-foreground">
                Crie sua primeira categoria para organizar os produtos
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Categoria
              </Button>
            </Card>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="group relative">
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-lg"
                style={{ backgroundColor: category.color || '#6b7280' }}
              />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color || '#6b7280' }}
                    />
                    {category.name}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{category.productCount ?? 0} produtos</Badge>
                {category.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
