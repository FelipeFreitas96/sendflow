import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

export const AboutPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sobre o Projeto</h2>
      </div>

      <Card className="max-w-[800px] border-white/10 bg-card">
        <CardContent className="pt-6 space-y-4">
          <p className="leading-relaxed">
            Esse projeto é um teste para a <strong>SendFlow</strong> usando{" "}
            <strong>React + Firebase</strong>, com{" "}
            <strong>Authentication</strong> e <strong>Firestore</strong> pra
            persistência em tempo real.
          </p>

          <div className="pt-4 space-y-4">
            <h3 className="text-xl font-bold text-primary">
              Sobre o agendamento
            </h3>
            <p className="leading-relaxed">
              Como o plano Spark (gratuito) não permite o uso de{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                onSchedule
              </code>{" "}
              do Cloud Functions v2, o envio das mensagens agendadas foi
              implementado diretamente no frontend usando{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                onSnapshot
              </code>{" "}
              +{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                setTimeout
              </code>
              .
            </p>

            <div className="bg-muted/30 border-l-4 border-muted p-4 rounded-r-md italic text-muted-foreground text-sm">
              Essa abordagem funciona para demonstração e testes, mas não é a
              ideal para produção, já que depende do navegador estar aberto para
              processar a fila.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
