import { atom } from "recoil";


export const user = atom({
	key: "user",
	default: {},
})

export const contentData = atom({
	key: "contentData",
	default: []
})

export const previewData = atom({
	key: "previewData",
	default: null
})


export const description = atom({
	key: "description",
	default: ""
})

export const price = atom({
	key: "price",
	default: 0.0
})

export const videoDuration = atom({
	key: "videoDuratio",
	default: ""
})

export const audioDuration = atom({
	key: "audioDuratio",
	default: ""
})

export const uploadedContents = atom({
	key: "uploadedContents",
	default: []
})

export const BASE_URL = "https://jmgelx-ip-102-90-46-127.tunnelmole.net/api"