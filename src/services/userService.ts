import { User } from '@/models/entities';

const BASE_URL = '/api/users';

export interface NewUser {
  identification: string;
  name: string;
  lastName: string;
  phone: string;
  accountIban: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  name?: string;
  lastName?: string;
  phone?: string;
  accountIban?: string;
  email?: string;
  password?: string;
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Error fetching users: ${res.statusText}`);
  }
  const data: Omit<User, 'passwordHash'>[] = await res.json();
  return data;
}

export async function getUserById(
  identification: string
): Promise<Omit<User, 'passwordHash'>> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(identification)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`User ${identification} not found`);
    }
    throw new Error(`Error fetching user: ${res.statusText}`);
  }
  const data: Omit<User, 'passwordHash'> = await res.json();
  return data;
}


export async function createUser(
  user: NewUser
): Promise<Omit<User, 'passwordHash'>> {
  const payload = {
    identification: user.identification,
    name: user.name,
    last_name: user.lastName,
    phone: user.phone,
    account_iban: user.accountIban,
    email: user.email,
    password: user.password,
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error creating user: ${errorData.error || res.statusText}`);
  }

  const data: Omit<User, 'passwordHash'> = await res.json();
  return data;
}

export async function updateUser(
  identification: string,
  updates: UpdateUser
): Promise<Omit<User, 'passwordHash'>> {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    payload.name = updates.name;
  }
  if (updates.lastName !== undefined) {
    payload.last_name = updates.lastName;
  }
  if (updates.phone !== undefined) {
    payload.phone = updates.phone;
  }
  if (updates.accountIban !== undefined) {
    payload.account_iban = updates.accountIban;
  }
  if (updates.email !== undefined) {
    payload.email = updates.email;
  }
  if (updates.password !== undefined) {
    payload.password = updates.password;
  }

  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(identification)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Error updating user: ${errorData.error || res.statusText}`);
  }

  const data: Omit<User, 'passwordHash'> = await res.json();
  return data;
}

export async function deleteUser(identification: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(identification)}`,
    {
      method: 'DELETE',
    }
  );
  if (!res.ok && res.status !== 204) {
    const errorData = await res.json();
    throw new Error(`Error deleting user: ${errorData.error || res.statusText}`);
  }
}
