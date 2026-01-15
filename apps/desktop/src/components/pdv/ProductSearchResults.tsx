/**
 * @file ProductSearchResults - Resultados da busca de produtos
 * @description Dropdown com produtos encontrados na busca
 */

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts } from '@/hooks/use-products';
import { cn, formatCurrency } from '@/lib/utils';
import { type Product } from '@/types';
import { AlertTriangle, Loader2, Package } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';

interface ProductSearchResultsProps {
  query: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

export const ProductSearchResults: FC<ProductSearchResultsProps> = ({
  query,
  onSelect,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: products, isLoading } = useProducts({
    search: query,
    isActive: true,
  });

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!products || products.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, products.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter': {
          e.preventDefault();
          const product = products[selectedIndex];
          if (product) {
            onSelect(product);
          }
          break;
        }
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, selectedIndex, onSelect, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (isLoading) {
    return (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border bg-card p-4 shadow-lg">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Buscando...</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border bg-card p-4 shadow-lg">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Nenhum produto encontrado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border bg-card shadow-lg">
      <ScrollArea className="max-h-80">
        <div className="p-2">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md p-3 text-left',
                'transition-colors hover:bg-accent',
                index === selectedIndex && 'bg-accent'
              )}
            >
              {/* Info do produto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{product.name}</span>
                  {product.isWeighted && (
                    <Badge variant="secondary" className="text-xs">
                      Pesável
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{product.internalCode}</span>
                  {product.barcode && (
                    <>
                      <span>•</span>
                      <span>{product.barcode}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Estoque */}
              <div className="text-right">
                <div
                  className={cn(
                    'text-sm',
                    product.currentStock <= 0 && 'text-destructive',
                    product.currentStock > 0 &&
                      product.currentStock <= product.minStock &&
                      'text-warning'
                  )}
                >
                  {product.currentStock <= 0 ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Sem estoque
                    </span>
                  ) : (
                    `${product.currentStock} em estoque`
                  )}
                </div>
              </div>

              {/* Preço */}
              <div className="text-money text-lg font-bold w-24 text-right">
                {formatCurrency(product.salePrice)}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
