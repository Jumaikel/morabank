import { clients } from "@/lib/sseBus";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const clientId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      const write = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Registrar cliente
      clients.set(clientId, { id: clientId, write });

      // Keep-alive ping cada 10 segundos
      const ping = setInterval(() => {
        write("ping");
      }, 10000);

      // Desconexión
      request.signal.addEventListener("abort", () => {
        clearInterval(ping);
        clients.delete(clientId);
        console.log(`[SSE] Cliente desconectado: ${clientId}`);
      });

      write(":connected");
    },
  });

  console.log(`[SSE] Cliente conectado: ${clientId} (total: ${clients.size})`);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export function sendTransactionNotification(transaction: any) {
  const payload = JSON.stringify(transaction);
  console.log(`[SSE] Enviando notificación a ${clients.size} cliente(s)`);

  for (const [id, client] of clients) {
    try {
      client.write(payload);
    } catch (err) {
      console.warn(`[SSE] Error enviando a ${id}:`, err);
      clients.delete(id);
    }
  }
}
