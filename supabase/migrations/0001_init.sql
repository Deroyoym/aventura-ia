-- La Hora Trece: salas, asientos y bitácora de turnos.
--
-- Las tres tablas tienen RLS activado y ninguna política: desde el navegador
-- (clave pública) no se puede leer ni escribir nada. Solo las routes del
-- servidor, con la clave secreta, tocan estos datos.

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{5}$'),
  -- Estado completo de la partida (EstadoJuego).
  state jsonb not null,
  -- Sube en cada guardado; permite concurrencia optimista.
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seats (
  room_id uuid not null references public.rooms (id) on delete cascade,
  seat smallint not null check (seat in (1, 2)),
  -- SHA-256 del token que guarda el celular; el token nunca se almacena.
  token_hash text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (room_id, seat)
);

create table public.turns (
  id bigint generated always as identity primary key,
  room_id uuid not null references public.rooms (id) on delete cascade,
  turn integer not null,
  kind text not null,
  seat smallint,
  action text,
  roll jsonb,
  narration text not null,
  -- Respuesta del modelo tal como se interpretó, para depurar.
  output jsonb,
  created_at timestamptz not null default now()
);

create index turns_room_turn_idx on public.turns (room_id, turn);

alter table public.rooms enable row level security;
alter table public.seats enable row level security;
alter table public.turns enable row level security;
