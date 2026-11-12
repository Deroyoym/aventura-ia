-- Mesas de hasta seis jugadores: los asientos van de 1 a 6.
alter table public.seats drop constraint seats_seat_check;
alter table public.seats add constraint seats_seat_check check (seat between 1 and 6);
