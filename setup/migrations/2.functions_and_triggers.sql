create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


create or replace function get_artist(aid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  avatar_url text,
  color text,
  musics json
)
language plpgsql
as $$
BEGIN
return query
  SELECT artists.id,
  artists.name,
  artists.avatar_url,
  artists.color,
  (SELECT json_agg(row_to_json(data)) from (select * from get_artist_musics(aid, my_id)) data)::json musics

  from artists

  where artists.id = aid;
END;
$$;

create or replace function get_artist_musics(aid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  genre_name text,
  album_name text,
  duration int,
  url text,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  genres.name genre_name,
  musics.album_name,
  musics.duration,
  musics.url,
  (SELECT EXISTS(SELECT * from music_likes where music_likes.music_id = musics.id and music_likes.user_id = my_id)) liked_by_me

  from musics
  join artists on musics.artist_id = artists.id
  join genres on musics.genre_id = genres.id

  where musics.artist_id = aid
  order by musics.created_at asc;
END;
$$;

create or replace function get_featured_playlists(my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean,
  color text
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me,
  playlists.color

  from featured_playlists
  join playlists on playlists.id = featured_playlists.playlist_id
  join profiles on profiles.id = playlists.author_id


  limit 10;
END;
$$;

create or replace function get_genre(gid text, my_id uuid)
returns table(
  id text,
  name text,
  color text,
  playlists json
)
language plpgsql
as $$
BEGIN
return query
  SELECT genres.id,
  genres.name,
  genres.color,
  (SELECT json_agg(row_to_json(data)) from (select * from get_genre_playlists(gid, my_id)) data)::json playlists

  from genres

  where genres.id = gid;
END;
$$;

create or replace function get_genre_playlists(gid text, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me

  from playlists
  join profiles on profiles.id = playlists.author_id

  where (playlists.genre_data->> gid)::float >= 0.4
  order by playlists.created_at desc;
END;
$$;

create or replace function get_home(my_id uuid)
returns table(
  history json,
  featured json,
  popular json
)
language plpgsql
as $$
BEGIN
return query
SELECT
  (SELECT json_agg(row_to_json(data)) from (select * from get_playlist_history(my_id)) data)::json history,
  (SELECT json_agg(row_to_json(data)) from (select * from get_featured_playlists(my_id)) data)::json featured,
  (SELECT json_agg(row_to_json(data)) from (select * from get_popular_playlists(my_id)) data)::json popular
  limit 1;
END;
$$;

create or replace function get_library(my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  last_played_at timestamptz,
  added_at timestamptz
)
language plpgsql
as $$
BEGIN
return query

  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  users_playlists.last_played_at,
  users_playlists.added_at

  from users_playlists
  join playlists on users_playlists.playlist_id = playlists.id
  join profiles on profiles.id = playlists.author_id

  where users_playlists.user_id = my_id
  order by playlists.created_at desc;
END;
$$;

create or replace function get_liked_library(my_id uuid)
returns table(
  liked_musics int,
  last_played_at timestamptz,
  added_at timestamptz
)
language plpgsql
as $$
BEGIN
return query
  SELECT
  (SELECT count(*) from music_likes where music_likes.user_id = my_id)::integer liked_musics,
  profiles.last_played_liked_music_at last_played_at,
  (SELECT music_likes.liked_at from music_likes where music_likes.user_id = my_id order by music_likes.liked_at desc limit 1) added_at

  from profiles
  where profiles.id = my_id;
END;
$$;

create or replace function get_liked_musics(my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  genre_name text,
  album_name text,
  duration int,
  url text,
  music_order int,
  added_at timestamptz,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  genres.name genre_name,
  musics.album_name,
  musics.duration,
  musics.url,
  (ROW_NUMBER () OVER (ORDER BY music_likes.liked_at asc))::int music_order,
  music_likes.liked_at added_at,
  true liked_by_me

  from music_likes
  join musics on music_likes.music_id = musics.id
  join artists on musics.artist_id = artists.id
  join genres on musics.genre_id = genres.id

  where music_likes.user_id = my_id
  order by music_likes.liked_at asc;
END;
$$;

create or replace function get_liked_musics_ids(my_id uuid)
returns table(
  id uuid,
  playlist_id text
)
language plpgsql
as $$
BEGIN
return query
  SELECT music_likes.music_id id,
  'liked' playlist_id

  from music_likes
  
  where music_likes.user_id = my_id
  order by music_likes.liked_at asc;
END;
$$;

create or replace function get_music_info(mid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  album_name text,
  duration int,
  url text,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  musics.album_name,
  musics.duration,
  musics.url,
  (SELECT EXISTS(SELECT * from music_likes where music_likes.music_id = musics.id and music_likes.user_id = my_id)) liked_by_me

  from musics
  join artists on musics.artist_id = artists.id

  where musics.id = mid;
END;
$$;

create or replace function get_playlist(pid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  color text,
  author_id uuid,
  author_name text,
  save_count int,
  saved_by_me boolean,
  musics json,
  genre_data json,
  created_at timestamptz
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  playlists.color,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT count(*) from users_playlists where users_playlists.playlist_id = playlists.id)::integer save_count,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me,
  (SELECT json_agg(row_to_json(data)) from (select * from get_playlist_musics(pid, my_id)) data)::json musics,
  playlists.genre_data::json,
  playlists.created_at

  from playlists
  join profiles on playlists.author_id = profiles.id

  where playlists.id = pid;
END;
$$;

create or replace function get_playlist_genres(pid uuid)
returns table(
  genre text
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.genre_id genre

  from playlists_musics
  join musics on musics.id = playlists_musics.music_id

  where playlists_musics.playlist_id = pid;
END;
$$;

create or replace function get_playlist_history(my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean,
  color text
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me,
  playlists.color

  from playlist_history
  join playlists on playlists.id = playlist_history.playlist_id
  join profiles on profiles.id = playlists.author_id

  where playlist_history.user_id = my_id
  
  order by playlist_history.last_played_at desc
  limit 6;
END;
$$;

create or replace function get_playlist_musics(pid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  genre_name text,
  album_name text,
  duration int,
  url text,
  music_order int,
  added_at timestamptz,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  genres.name genre_name,
  musics.album_name,
  musics.duration,
  musics.url,
  playlists_musics.order music_order,
  playlists_musics.added_at,
  (SELECT EXISTS(SELECT * from music_likes where music_likes.music_id = musics.id and music_likes.user_id = my_id)) liked_by_me

  from playlists_musics
  join musics on playlists_musics.music_id = musics.id
  join artists on musics.artist_id = artists.id
  join genres on musics.genre_id = genres.id

  where playlists_musics.playlist_id = pid
  order by playlists_musics.order asc;
END;
$$;

create or replace function get_playlist_musics_ids(pid uuid, my_id uuid)
returns table(
  id uuid,
  playlist_id uuid
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists_musics.music_id id,
  playlists_musics.playlist_id playlist_id

  from playlists_musics
  
  where playlists_musics.playlist_id = pid
  order by playlists_musics.order asc;
END;
$$;

create or replace function get_popular_playlists(my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean,
  color text,
  save_count int
)
language plpgsql
as $$
BEGIN
return query
WITH cte AS (
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me,
  playlists.color,
  (SELECT count(*) from users_playlists where users_playlists.playlist_id = playlists.id)::integer save_count
  from playlists
  join profiles on profiles.id = playlists.author_id
)
SELECT * from cte
where cte.save_count > 1
order by cte.save_count desc
limit 10;
END;
$$;

create or replace function get_profile(pid uuid, my_id uuid)
returns table(
  id uuid,
  username text,
  avatar_url text,
  color text,
  playlists json
)
language plpgsql
as $$
BEGIN
return query
  SELECT profiles.id,
  profiles.username,
  profiles.avatar_url,
  profiles.color,
  (SELECT json_agg(row_to_json(data)) from (select * from get_profile_playlists(pid, my_id)) data)::json playlists

  from profiles

  where profiles.id = pid;
END;
$$;

create or replace function get_profile_playlists(pid uuid, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me

  from playlists
  join profiles on profiles.id = playlists.author_id

  where playlists.author_id = pid
  order by playlists.created_at desc;
END;
$$;

create or replace function get_queue_info(mids uuid[], my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  album_name text,
  duration int,
  url text,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  musics.album_name,
  musics.duration,
  musics.url,
  (SELECT EXISTS(SELECT * from music_likes where music_likes.music_id = musics.id and music_likes.user_id = my_id)) liked_by_me

  from musics
  join artists on musics.artist_id = artists.id

  where musics.id = ANY(mids);
END;
$$;

create or replace function get_search(search_term text, my_id uuid)
returns table(
  musics json,
  artists json,
  playlists json
)
language plpgsql
as $$
BEGIN
return query
SELECT
  (SELECT json_agg(row_to_json(data)) from (select * from search_musics(search_term, my_id)) data)::json musics,
  (SELECT json_agg(row_to_json(data)) from (select * from search_artists(search_term, my_id)) data)::json artists,
  (SELECT json_agg(row_to_json(data)) from (select * from search_playlists(search_term, my_id)) data)::json playlists
  limit 1;
END;
$$;

create or replace function search_artists(search_term text, my_id uuid)
returns table(
  id uuid,
  name text,
  avatar_url text,
  color text
)
language plpgsql
as $$
BEGIN
return query
  SELECT artists.id,
  artists.name,
  artists.avatar_url,
  artists.color

  from artists

  where artists.name ilike CONCAT('%',search_term,'%');
END;
$$;

create or replace function search_musics(search_term text, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  artist_id uuid,
  artist_name text,
  genre_name text,
  album_name text,
  duration int,
  url text,
  liked_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT musics.id,
  musics.name,
  musics.image_url,
  artists.id artist_id,
  artists.name artist_name,
  genres.name genre_name,
  musics.album_name,
  musics.duration,
  musics.url,
  (SELECT EXISTS(SELECT * from music_likes where music_likes.music_id = musics.id and music_likes.user_id = my_id)) liked_by_me

  from musics
  join artists on musics.artist_id = artists.id
  join genres on musics.genre_id = genres.id

  where musics.name ilike CONCAT('%',search_term,'%')
  or artists.name ilike CONCAT('%',search_term,'%')
  or musics.album_name ilike CONCAT('%',search_term,'%');
END;
$$;

create or replace function search_playlists(search_term text, my_id uuid)
returns table(
  id uuid,
  name text,
  image_url text,
  author_id uuid,
  author_name text,
  saved_by_me boolean
)
language plpgsql
as $$
BEGIN
return query
  SELECT playlists.id,
  playlists.name,
  playlists.image_url,
  profiles.id author_id,
  profiles.username author_name,
  (SELECT EXISTS(SELECT * from users_playlists where users_playlists.playlist_id = playlists.id and users_playlists.user_id = my_id)) saved_by_me

  from playlists
  join profiles on profiles.id = playlists.author_id

  where playlists.name ilike CONCAT('%',search_term,'%');
END;
$$;