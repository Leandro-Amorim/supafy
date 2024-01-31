import Scrollbars from "rc-scrollbars";
import { ReactNode } from "react";

export default function CustomScrollbar({ children }: { children: ReactNode }) {
	return (
		<Scrollbars universal hideTracksWhenNotNeeded={true} autoHide={true} renderThumbVertical={({ style, ...props }) => (
			<div {...props} style={{ ...style, backgroundColor: '#b3b3b3', borderRadius: 0, opacity: '0.3', cursor: 'default' }} />
		)}
			renderTrackVertical={({ style, ...props }) => (
				<div {...props} style={{ ...style, width: '12px', right: '0px' }} />
			)}
		>
			{children}
		</Scrollbars>
	)
}