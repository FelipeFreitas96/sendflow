import { useState } from 'react';
import { Plus, Trash2, Edit, Send, Clock, Check } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useConnections } from '../../connections/hooks/useConnections';
import { useContacts } from '../../contacts/hooks/useContacts';
import { createMessage, deleteMessage, updateMessage } from '../services/messages.service';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Badge } from "@/components/badge";
import { Textarea } from "@/components/textarea";
import { Checkbox } from "@/components/checkbox";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/scroll-area";

export const MessagesPage = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [connectionFilter, setConnectionFilter] = useState<string>('all');
  
  const { messages, loading: messagesLoading } = useMessages(
    connectionFilter === 'all' ? null : connectionFilter, 
    { status: statusFilter === 'all' ? undefined : statusFilter as any }
  );
  const { connections, loading: connectionsLoading } = useConnections();
  const loading = messagesLoading || connectionsLoading;
  
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const { contacts } = useContacts(selectedConnection || null);

  const handleOpen = (msg?: any) => {
    if (msg) {
      setEditingId(msg.id);
      setSelectedConnection(msg.connectionId);
      setSelectedContacts(msg.contactIds);
      setContent(msg.content);
      setScheduledAt(msg.scheduledAt ? new Date(msg.scheduledAt.toDate().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');
    } else {
      setEditingId(null);
      setSelectedConnection('');
      setSelectedContacts([]);
      setContent('');
      setScheduledAt('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!user || !selectedConnection || selectedContacts.length === 0) return;
    try {
      const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
      if (editingId) {
        await updateMessage(editingId, content, scheduledDate);
      } else {
        await createMessage(user.uid, selectedConnection, selectedContacts, content, scheduledDate);
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      await deleteMessage(id);
    }
  };

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mensagens</h2>
        <Button onClick={() => handleOpen()} disabled={loading} className="gap-2 font-bold">
          <Plus size={20} />
          Nova Mensagem
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-60">
          <Label className="mb-2 block">Status</Label>
          {loading ? (
            <Skeleton className="h-11 w-full rounded-xl" />
          ) : (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-card border-white/10">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="scheduled">Agendadas</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="w-full sm:w-60">
          <Label className="mb-2 block">Conexão</Label>
          {loading ? (
            <Skeleton className="h-11 w-full rounded-xl" />
          ) : (
            <Select value={connectionFilter} onValueChange={setConnectionFilter}>
              <SelectTrigger className="bg-card border-white/10">
                <SelectValue placeholder="Todas as Conexões" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">Todas as Conexões</SelectItem>
                {connections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Card className="border-white/10 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead>Conteúdo</TableHead>
              <TableHead>Conexão</TableHead>
              <TableHead>Contatos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {messages.map((msg) => (
                  <TableRow key={msg.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {msg.content}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {connections.find(c => c.id === msg.connectionId)?.name || 'Desconhecido'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {msg.contactIds.length} contatos
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={msg.status === 'sent' ? 'secondary' : 'outline'}
                        className={cn(
                          "font-bold gap-1",
                          msg.status === 'sent' ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
                        )}
                      >
                        {msg.status === 'sent' ? <Send size={12} /> : <Clock size={12} />}
                        {msg.status === 'sent' ? 'ENVIADA' : 'AGENDADA'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {msg.status === 'sent' 
                        ? msg.sentAt?.toDate().toLocaleString('pt-BR') 
                        : msg.scheduledAt?.toDate().toLocaleString('pt-BR') || 'Imediato'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {msg.status === 'scheduled' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpen(msg)}
                            title="Editar"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <Edit size={18} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(msg.id)}
                          title="Excluir"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {messages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Nenhuma mensagem encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px] bg-card border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? 'Editar Mensagem' : 'Nova Mensagem'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label>Conexão</Label>
              <Select 
                value={selectedConnection} 
                onValueChange={(val) => {
                  setSelectedConnection(val);
                  setSelectedContacts([]);
                }}
                disabled={!!editingId}
              >
                <SelectTrigger className="bg-background border-white/10">
                  <SelectValue placeholder="Selecione uma conexão" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {connections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Contatos ({selectedContacts.length})</Label>
                {selectedConnection && contacts.length > 0 && (
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-xs text-primary"
                    onClick={() => {
                      if (selectedContacts.length === contacts.length) setSelectedContacts([]);
                      else setSelectedContacts(contacts.map(c => c.id));
                    }}
                  >
                    {selectedContacts.length === contacts.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </Button>
                )}
              </div>
              
              <ScrollArea className="h-32 w-full rounded-md border border-white/10 bg-background p-2">
                {!selectedConnection ? (
                  <p className="text-xs text-muted-foreground text-center py-8">Selecione uma conexão primeiro</p>
                ) : contacts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">Nenhum contato nesta conexão</p>
                ) : (
                  <div className="grid grid-cols-1 gap-1">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-center space-x-2 p-1.5 rounded hover:bg-white/5 cursor-pointer"
                        onClick={() => toggleContact(contact.id)}
                      >
                        <Checkbox 
                          id={`contact-${contact.id}`} 
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => toggleContact(contact.id)}
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo da Mensagem</Label>
              <Textarea
                id="content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="bg-background border-white/10 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Agendar para (Opcional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-background border-white/10 block"
              />
              <p className="text-[10px] text-muted-foreground">Deixe vazio para enviar imediatamente</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="font-bold"
              disabled={!selectedConnection || selectedContacts.length === 0 || !content}
            >
              {editingId ? 'Salvar Alterações' : (scheduledAt ? 'Agendar' : 'Enviar Agora')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
