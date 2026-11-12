-- Depósito público para los retratos pintados de los personajes. Solo el
-- servidor, con la clave secreta, puede subir; cualquiera con la dirección
-- puede ver la imagen (no hay listado: sin políticas, no se puede enumerar).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('retratos', 'retratos', true, 524288, array['image/webp'])
on conflict (id) do nothing;
