import { BasicGenre } from "@/types/database/BasicGenre";
import { Box, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function GenreCard({ genre }: { genre: BasicGenre }) {

	return (
		<LinkBox>
			<LinkOverlay href={`/genre/${genre.id}`} as={Link}>
				<Box className="w-full aspect-square relative rounded-lg overflow-hidden" backgroundColor={genre.color}>
					<Text className="p-4 font-bold text-white text-2xl break-words max-w-full select-none z-20 relative">
						{genre.name}
					</Text>
					{
						genre.image_url &&
						<Image alt="Genre Image" width={100} height={100} src={genre.image_url} className="z-10 absolute right-0 bottom-0" draggable={false} style={{ transform: 'rotate(25deg) translate(18%,-2%)' }} />
					}
				</Box>
			</LinkOverlay>
		</LinkBox>
	)
}