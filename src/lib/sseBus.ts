type SSEClient = {
  id: string;
  write: (data: string) => void;
};

const globalClientsKey = "__SSE_CLIENTS__";

if (!(global as any)[globalClientsKey]) {
  (global as any)[globalClientsKey] = new Map<string, SSEClient>();
}

export const clients: Map<string, SSEClient> = (global as any)[globalClientsKey];
