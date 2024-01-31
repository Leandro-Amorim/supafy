import SideBar from "@/components/sidebar/SideBar";
import PlayBar from "@/components/playbar/PlayBar";
import { Flex } from "@chakra-ui/react";
import MainContainer from "@/components/shared/MainContainer";
import GenreHeader from "@/components/genre/GenreHeader";
import PlaylistCardContainer from "@/components/shared/PlaylistCardContainer";
import PlaylistCard from "@/components/shared/PlaylistCard";
import GenreHeaderContent from "@/components/genre/GenreHeaderContent";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Page from "@/components/shared/Page";
import { Database } from "@/supabase";
import { GetServerSideProps } from "next";
import { nullUUID } from "@/lib/utils";
import { Genre } from "@/types/database/Genre";

export default function Genre({ genre }: { genre: Genre }) {
	return (
		<Page>
			<Flex grow={1} minH={0}>
				<SideBar />
				<MainContainer primaryGradientHeight={'286px'} distanceToReveal={'286px'} color={genre.color} headerContent={<GenreHeaderContent genre={genre} />}>
					<GenreHeader genre={genre} />
					<PlaylistCardContainer title={genre.name + ' Playlists'}>
						{
							genre.playlists?.map((el) => {
								return (<PlaylistCard playlist={el} key={el.id} />)
							})
						}
					</PlaylistCardContainer>
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

	const result = await supabase.rpc('get_genre', { gid: (context.params?.id as string) ?? nullUUID, my_id: client_id ?? nullUUID }).single();

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
			genre: result.data,
		},
	}
}) satisfies GetServerSideProps;
