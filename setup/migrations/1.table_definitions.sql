create table
  public.artists (
    name text not null,
    avatar_url text not null default ''::text,
    color text not null,
    created_at timestamp with time zone not null default now(),
    id uuid not null default gen_random_uuid (),
    constraint artists_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.genres (
    id text not null,
    name text not null,
    color text not null,
    image_url text not null default ''::text,
    constraint genres_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.musics (
    name text not null,
    image_url text null,
    genre_id text not null,
    album_name text not null,
    duration integer not null default 0,
    created_at timestamp with time zone not null default now(),
    id uuid not null default gen_random_uuid (),
    artist_id uuid not null,
    url text null,
    constraint musics_pkey primary key (id),
    constraint musics_artist_id_fkey foreign key (artist_id) references artists (id) on delete set null,
    constraint musics_genre_id_fkey foreign key (genre_id) references genres (id) on delete set null
  ) tablespace pg_default;

  create table
  public.profiles (
    id uuid not null,
    username text not null default ''::text,
    created_at timestamp with time zone not null default now(),
    avatar_url text not null default ''::text,
    color text not null default 'royalblue'::text,
    last_played_liked_music_at timestamp with time zone not null default now(),
    signup_completed boolean not null default false,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

  create table
  public.music_likes (
    user_id uuid not null,
    music_id uuid not null,
    liked_at timestamp with time zone not null default now(),
    constraint music_likes_pkey primary key (user_id, music_id),
    constraint music_likes_music_id_fkey foreign key (music_id) references musics (id) on delete cascade,
    constraint music_likes_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.playlists (
    name text not null,
    image_url text null default ''::text,
    author_id uuid not null,
    created_at timestamp with time zone not null default now(),
    color text not null default 'white'::text,
    genre_data jsonb not null default '{}'::jsonb,
    id uuid not null default gen_random_uuid (),
    constraint playlists_pkey primary key (id),
    constraint playlists_author_id_fkey foreign key (author_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.playlists_musics (
    "order" integer not null,
    added_at timestamp with time zone not null default now(),
    playlist_id uuid not null,
    music_id uuid not null,
    constraint playlists_musics_pkey primary key (playlist_id, music_id),
    constraint playlists_musics_music_id_fkey foreign key (music_id) references musics (id) on delete cascade,
    constraint playlists_musics_playlist_id_fkey foreign key (playlist_id) references playlists (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.playlist_history (
    playlist_id uuid not null,
    last_played_at timestamp with time zone not null default now(),
    user_id uuid not null,
    constraint playlist_history_pkey primary key (playlist_id, user_id),
    constraint playlist_history_playlist_id_fkey foreign key (playlist_id) references playlists (id) on delete cascade,
    constraint playlist_history_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.users_playlists (
    user_id uuid not null,
    last_played_at timestamp with time zone not null default now(),
    added_at timestamp with time zone not null default now(),
    playlist_id uuid not null,
    constraint users_playlists_pkey primary key (user_id, playlist_id),
    constraint users_playlists_playlist_id_fkey foreign key (playlist_id) references playlists (id) on delete cascade,
    constraint users_playlists_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.featured_playlists (
    playlist_id uuid not null,
    constraint featured_playlists_pkey primary key (playlist_id),
    constraint featured_playlists_playlist_id_fkey foreign key (playlist_id) references playlists (id) on delete cascade
  ) tablespace pg_default;