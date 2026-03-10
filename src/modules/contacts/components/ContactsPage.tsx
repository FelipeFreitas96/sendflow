import React, { useState } from 'react';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import { createContact, deleteContact, updateContact } from '../services/contacts.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { useConnections } from '../../connections/hooks/useConnections';
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

export const ContactsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { contacts, loading: contactsLoading } = useContacts(id);
  const { connections, loading: connectionsLoading } = useConnections();
  const connection = connections.find(c => c.id === id);
  const loading = contactsLoading || connectionsLoading;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpen = (contact?: any) => {
    if (contact) {
      setEditingId(contact.id);
      setName(contact.name);
      setPhone(contact.phone);
    } else {
      setEditingId(null);
      setName('');
      setPhone('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setPhone('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!user || !id) return;
    try {
      if (editingId) {
        await updateContact(editingId, name, phone);
      } else {
        await createContact(user.uid, id, name, phone);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      await deleteContact(contactId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <nav className="flex text-sm text-muted-foreground gap-2">
          <RouterLink to="/connections" className="hover:text-primary underline-offset-4 hover:underline">
            Conexões
          </RouterLink>
          <span>/</span>
          {loading ? <Skeleton className="h-4 w-24" /> : <span className="text-foreground font-medium">{connection?.name || 'Não encontrada'}</span>}
        </nav>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/connections')}
              className="h-9 w-9 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Contatos</h2>
          </div>
          <Button onClick={() => handleOpen()} disabled={loading} className="gap-2 font-bold">
            <Plus size={20} />
            Novo Contato
          </Button>
        </div>
      </div>

      <Card className="border-white/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
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
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.phone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.createdAt?.toDate().toLocaleDateString('pt-BR') || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpen(contact)}
                          title="Editar"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          title="Excluir"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      Nenhum contato encontrado. Crie um para começar!
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
              {editingId ? 'Editar Contato' : 'Novo Contato'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                autoFocus
                className="bg-background border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 5511999999999"
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
