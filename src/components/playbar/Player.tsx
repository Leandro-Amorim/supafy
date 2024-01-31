import { playerRefState, playerState, queueState } from '@/lib/atoms';
import { useDidUpdateEffect } from '@/lib/hooks';
import { processQueue } from '@/lib/playerUtils';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { useRecoilState, useSetRecoilState } from 'recoil';

export default function Player() {
	const ref = useRef<ReactPlayer>(null);
	const setPlayerRef = useSetRecoilState(playerRefState);

	const [player, setPlayer] = useRecoilState(playerState);
	const [queue, setQueue] = useRecoilState(queueState);

	const [hasWindow, setHasWindow] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setHasWindow(true);
		}
	}, []);

	function onProgress(state: OnProgressProps) {
		setPlayer((prev) => { return { ...prev, seek: state.playedSeconds } })
	}
	function onDuration(dur: number) {
		setPlayer((prev) => { return { ...prev, duration: dur } })
	}

	function onEnd() {
		processQueue(queue, setQueue, player, setPlayer);
	}

	useEffect(() => {
		setPlayerRef(ref);
	});

	useEffect(() => {
		const localData = localStorage?.getItem('queue');
		if (localData !== null) {
			setQueue(JSON.parse(localData));
		}
	}, []);

	useDidUpdateEffect(() => {
		console.log(queue);
		localStorage?.setItem('queue', JSON.stringify(queue));
	}, [queue]);

	return (
		<>
			{
				hasWindow && <ReactPlayer ref={ref} loop={player.loopMusic} muted={player.muted} volume={player.volume} playing={player.playing} url={queue.currentMusic.url}
					onProgress={onProgress} onDuration={onDuration} onEnded={onEnd} style={{ display: 'none' }} stopOnUnmount={false} />
			}
		</>
	)
}

