import { useRecoilCallback } from "recoil";
import { contentData } from "../states";


export const useAddContent = () => {
	const addContent = useRecoilCallback(
		({ set }) => (file, type, id) => {
			set(contentData, cur => [...cur, { id, type, file: new File([file], file.name, { type: file.type }) }]);
		}
	);
	return addContent;
}


export const fileTypes = {
	IMAGE: 'image',
	VIDEO: 'video',
	AUDIO: 'audio',
	FILE: 'file',
	PREVIEW: 'preview'
}

function str_pad_left(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

export const formatDuration = (sec) => {
	const minutes = Math.floor(sec / 60);
	const seconds = Math.floor(sec % 60);
	return `${str_pad_left(minutes, '0', 2)}:${str_pad_left(seconds, '0', 2)}`;
}
