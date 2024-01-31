import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { Box, Flex, Text } from "@chakra-ui/react";
import MainContainer from "@/components/shared/MainContainer";
import ArtistHeaderContent from "@/components/artist/ArtistHeaderContent";
import ArtistHeader from "@/components/artist/ArtistHeader";
import MusicTable from "@/components/shared/MusicTable";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Page from "@/components/shared/Page";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { nullUUID } from "@/lib/utils";
import { Artist } from "@/types/database/Artist";

export default function Artist({ artist }: { artist: Artist }) {

	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer color={artist.color} headerContent={<ArtistHeaderContent artist={artist} />}>
					<ArtistHeader artist={artist} />
					<Box w='100%' marginTop={'20px'} marginBottom={'18px'}  position={'relative'} zIndex={99}>
						<Text color={'white'} fontSize={'24px'} fontWeight={700}>Songs</Text>
					</Box>
					<MusicTable artist={artist} />
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

	const result = await supabase.rpc('get_artist', { aid: (context.params?.id as string) ?? nullUUID, my_id: client_id ?? nullUUID }).single();

	if (result.error) { console.error(result.error) }

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
			artist: result.data,
		},
	}
}) satisfies GetServerSideProps;
