export interface IStory {
	by?: string,
	descendants?: number,
	id: number,
	image: string,
	kids?: number[],
	score: number,
	time: number,
	title: string,
	type: string,
	url: string
}