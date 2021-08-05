export interface IStory {
	by: string,
	user: IUser,
	descendants?: number,
	id: number,
	image: string,
	kids?: number[],
	score: number,
	time: number,
	date: Date,
	title: string,
	type: string,
	url: string
}

export interface IUser {
	name: string,
	karma: number
}