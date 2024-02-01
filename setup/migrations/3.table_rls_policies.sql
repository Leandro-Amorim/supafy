-- Artists

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.artists
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Featured Playlists

ALTER TABLE public.featured_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.featured_playlists
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Genres

ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.genres
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Music Likes

ALTER TABLE public.music_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable delete for users based on user_id" ON public.music_likes
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON public.music_likes
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.music_likes
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON public.music_likes
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Musics

ALTER TABLE public.musics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.musics
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Playlist History

ALTER TABLE public.playlist_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable access to users based on user_id" ON public.playlist_history
AS PERMISSIVE FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Playlists

ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.playlists
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable delete for users based on author_id" ON public.playlists
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = author_id);

CREATE POLICY "Enable insert for users based on author_id" ON public.playlists
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable update for users based on author_id" ON public.playlists
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Playlists Musics

ALTER TABLE public.playlists_musics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.playlists_musics
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable delete for playlist owner" ON public.playlists_musics
AS PERMISSIVE FOR DELETE
TO public
USING ((EXISTS ( SELECT playlists.id FROM playlists WHERE ((playlists.id = playlists_musics.playlist_id) AND (playlists.author_id = auth.uid())))));

CREATE POLICY "Enable insert for playlist owner" ON public.playlists_musics
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK ((EXISTS ( SELECT playlists.id FROM playlists WHERE ((playlists.id = playlists_musics.playlist_id) AND (playlists.author_id = auth.uid())))));

CREATE POLICY "Enable update for playlist owner" ON public.playlists_musics
AS PERMISSIVE FOR UPDATE
TO public
USING ((EXISTS ( SELECT playlists.id FROM playlists WHERE ((playlists.id = playlists_musics.playlist_id) AND (playlists.author_id = auth.uid())))))
WITH CHECK ((EXISTS ( SELECT playlists.id FROM playlists WHERE ((playlists.id = playlists_musics.playlist_id) AND (playlists.author_id = auth.uid())))));

-- Profiles

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.profiles
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON public.profiles
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" ON public.profiles
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.profiles
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users Playlists

ALTER TABLE public.users_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.users_playlists
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON public.users_playlists
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON public.users_playlists
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.users_playlists
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);