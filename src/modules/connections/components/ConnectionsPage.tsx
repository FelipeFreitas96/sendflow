import React, { useState } from 'react';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../hooks/useConnections';
import { createConnection, deleteConnection, updateConnection } from '../services/connections.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dialog";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card } from "@/components/card";

export const ConnectionsPage = () => {
  const { connections, loading } = useConnections();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpen = (conn?: any) => {
    if (conn) {
      setEditingId(conn.id);
      setName(conn.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      if (editingId) {
        await updateConnection(editingId, name);
      } else {
        await createConnection(user.uid, name);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conexão?')) {
      await deleteConnection(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conexões</h2>
        <Button onClick={() => handleOpen()} disabled={loading} className="gap-2 font-bold">
          <Plus size={20} />
          Nova Conexão
        </Button>
      </div>

      <Card className="border-white/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead>Nome</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {connections.map((conn) => (
                  <TableRow key={conn.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium">{conn.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {conn.createdAt?.toDate().toLocaleDateString('pt-BR') || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/connections/${conn.id}`)}
                          title="Ver Contatos"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpen(conn)}
                          title="Editar"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(conn.id)}
                          title="Excluir"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {connections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      Nenhuma conexão encontrada. Crie uma para começar!
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? 'Editar Conexão' : 'Nova Conexão'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Conexão</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: WhatsApp Vendas"
                autoFocus
                className="bg-background border-white/10"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="font-bold">
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
