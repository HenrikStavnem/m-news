import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IStory, IUser, IUserRich } from '../interfaces/story';

@Injectable({
	providedIn: 'root'
})
export class StoryMapper {	
	public async getStories(): Promise<IStory[]>  {
		let stories: IStory[] = [];

		await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
			.then(response => response.json())
			.then(async data => {
				const selectedStoryids = this.getRandomStoryIds(data);

				stories = await this.fetchStoriesData(selectedStoryids);
			}
		);

		return stories;
	}

	public async getUser(id: string): Promise<IUserRich> {
		return await this.fetchUserRich(id);
	}

	public async getUserStories(storyIds: number[]) {
		let stories: IStory[] = [],
			selectedStoryids: number[] = this.getFirstTenStoryIds(storyIds);
		
		stories = await this.fetchStoriesData(selectedStoryids);

		return stories;
	}

	private async fetchStoriesData(ids: number[]): Promise<IStory[]> {
		const me: this = this;
		let responses: Promise<IStory>[] = [],
			stories: IStory[] = [];

		ids.forEach(id => {
			let response: Promise<IStory> = fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json());
			responses.push(response);
		});

		await Promise.all(responses)
			.then(function handleData(data) {				
				data.forEach(async storyData => {
					if (storyData.type === 'story') { // we only want stories, not comments and polls
						let user: IUser = await me.fetchUser(storyData.by),
							story: IStory = {
							id: storyData.id,
							by: storyData.by,
							score: storyData.score,
							time: storyData.time,
							date: new Date(storyData.time * 1000), //convert from seconds (UNIX) to milliseconds (Date)
							type: storyData.type,
							url: storyData.url,
							title: storyData.title,
							user: user,
							image: me.pickRandomHeaderImage()
						};

						stories.push(story);
					}
				});
			})
			console.log('before sort', stories);
			stories = stories.sort(this.sortStoriesByScore());
			console.log('after sort', stories);

			return stories;
	}

	private async fetchUser(id: string): Promise<IUser> {
		let user: IUser = {name: '', karma: 0};

		await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
			.then(response => response.json())
			.then(async data => {
				user = {
					name: data.id ? data.id : 'unknown',
					karma: data.karma
				};
			}
		);
		return user;
	}

	private async fetchUserRich(id: string): Promise<IUserRich> {
		let user: IUserRich = {name: '', karma: 0, submitted: []};

		await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
			.then(response => response.json())
			.then(async data => {
				console.log('data', data);
				user = {
					name: data.id ? data.id : 'unknown',
					karma: data.karma,
					submitted: data.submitted ? data.submitted : []
				};

				if (data.about) {
					user.about = data.about;
				}
			}
		);
		return user;
	}

	private sortStoriesByScore() {
		console.log('sorting...');

		return function(a: any, b: any) {
			console.log('sort', a['score'], b['score']);
			if (a['score'] > b['score']) {
				console.log('a>b');
				return 1;
			}
			else if (a['score'] < b['score']) {
				console.log('a<b');
				return -1;
			}
			else {
				console.log('a=b');
				return 0;
			}
		}
	}

	private pickRandomHeaderImage(): string {
		const images = [
			'card-header-01.jpg',
			'card-header-02.jpg',
			'card-header-03.jpg',
			'card-header-04.jpg',
			'card-header-05.jpg',
			'card-header-06.jpg',
			'card-header-07.jpg'
		],
		randomIndex = Math.floor(Math.random() * images.length);

		return images[randomIndex];
	}

	
	private getRandomStoryIds(storyIds: number[]): number[] {
		let tempIds: number[] = storyIds,
			selectedIds: number[] = [];

		for(let i = 0; i < 10; i++) {
			let randomIndex = Math.floor(Math.random() * tempIds.length);

			selectedIds.push( tempIds[randomIndex] );
			tempIds.splice(randomIndex, 1);
		}

		return selectedIds;
	}

	private getFirstTenStoryIds(storyIds: number[]): number[] {
		return storyIds.slice(0, 10);
	}
}