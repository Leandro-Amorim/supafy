
import { Flex } from "@chakra-ui/react";
import MainContainer from "@/components/shared/MainContainer";
import PlaylistHeader from "@/components/playlist/PlaylistHeader";
import PlaylistActions from "@/components/playlist/PlaylistActions";
import MusicTable from "@/components/shared/MusicTable";
import PlaylistHeaderContent from "@/components/playlist/PlaylistHeaderContent";
import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Page from "@/components/shared/Page";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { Playlist } from "@/types/database/Playlist";

export default function LikedPlaylist({ playlist }: {playlist: Playlist}) {

	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer color={playlist.color} headerContent={<PlaylistHeaderContent playlist={playlist} />} >
					<PlaylistHeader playlist={playlist} />
					<PlaylistActions playlist={playlist} />
					<MusicTable playlist={playlist} />
				</MainContainer>
			</Flex>
			<PlayBar />
		</Page>
	)
}

export const getServerSideProps = (async (context) => {
	const supabase = createPagesServerClient<Database>(context);
	const { data: { session } } = await supabase.auth.getSession();
	const client_id = session?.user?.id ?? null;


	if (!client_id) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const profile = (await supabase.from('profiles').select('*').eq('id', client_id).single()).data;
	if (profile && profile.signup_completed === false) {
		return {
			redirect: {
				destination: '/complete_profile',
				permanent: false,
			},
		}
	}

	let query = supabase.rpc('get_liked_musics', { my_id: client_id });
	const result = await query;
	if (result.error) { console.log(result.error) }

	const author_name = (await supabase.from('profiles').select('username').eq('id', client_id).single()).data?.username ?? '';

	const playlist = {
		id: 'liked',
		name: 'Liked Songs',
		image_url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
		color: 'rgb(80, 56, 160)',
		author_id: client_id,
		author_name,
		save_count: 0,
		saved_by_me: true,
		musics: result.data,
	};

	return {
		props: {
			playlist,
		},
	}
}) satisfies GetServerSideProps;