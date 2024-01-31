
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
import { nullUUID } from "@/lib/utils";
import { Playlist } from "@/types/database/Playlist";

export default function Playlist({ playlist }: { playlist: Playlist }) {

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

	let query = supabase.rpc('get_playlist', { pid: (context.params?.id as string) ?? nullUUID, my_id: client_id ?? nullUUID }).single();
	const result = await query;
	if (result.error) { console.log(result.error) }

	if (!result.data) {
		return {
			redirect: {
				destination: '/404',
				permanent: false,
			},
		}
	}

	if (client_id) {
		const profile = (await supabase.from('profiles').select('*').eq('id', client_id).single()).data;
		if (profile && profile.signup_completed === false) {
			return {
				redirect: {
					destination: '/complete_profile',
					permanent: false,
				},
			}
		}
	}

	return {
		props: {
			playlist: result.data,
		},
	}
}) satisfies GetServerSideProps;

