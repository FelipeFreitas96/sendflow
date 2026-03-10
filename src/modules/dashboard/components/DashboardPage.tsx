import { useConnections } from "../../connections/hooks/useConnections";
import { useMessages } from "../../messages/hooks/useMessages";
import { Link as LinkIcon, MessageSquare, Send, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";

export const DashboardPage = () => {
  const { connections, loading: connectionsLoading } = useConnections();
  const { messages: allMessages, loading: messagesLoading } = useMessages();

  const isLoading = connectionsLoading || messagesLoading;
  const sentMessages = allMessages.filter((m) => m.status === "sent");
  const scheduledMessages = allMessages.filter((m) => m.status === "scheduled");

  const stats = [
    {
      title: "Conexões",
      value: connections.length,
      icon: LinkIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total de Mensagens",
      value: allMessages.length,
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Enviadas",
      value: sentMessages.length,
      icon: Send,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Agendadas",
      value: scheduledMessages.length,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-white/10 bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-card">
        <CardHeader>
          <CardTitle className="text-primary font-bold">
            Bem-vindo ao SendFlow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              Gerencie suas conexões, contatos e agende mensagens com
              facilidade. Comece criando uma nova conexão na barra lateral.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
