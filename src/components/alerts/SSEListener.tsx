"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import { useNotificationStore } from "@/stores/notificationStore";

export default function SSEListener() {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const add = useNotificationStore((s) => s.add);
  useEffect(() => {
    if (!identification || !token) return;

    fetchUser(identification);

    const source = new EventSource("/api/sse");

    source.onmessage = (event) => {
      if (event.data === "ping" || event.data.startsWith(":")) return;

      try {
        const data = JSON.parse(event.data);
        console.log("[SSE] Evento recibido:", data);

        if (!selectedUser?.accountIban) {
          console.warn("[SSE] selectedUser.accountIban aún no disponible");
          return;
        }

        console.log("[SSE] Comparando contra:", selectedUser.accountIban);

        if (data.to === selectedUser.accountIban) {
          const msg = `💸 Has recibido ${data.amount.value} ${data.amount.currency}`;
          toast.success(msg);
          add(msg);
        }
      } catch (err) {
        console.warn("[SSE] Evento ignorado, no es JSON:", event.data);
      }
    };

    source.onerror = (e) => {
      console.error("[SSE] Error de conexión:", e);
      source.close();
    };

    return () => source.close();
  }, [identification, token, selectedUser?.accountIban]);

  return null;
}
