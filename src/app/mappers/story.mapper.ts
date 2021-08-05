import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IStory, IUser } from '../interfaces/story';
import { ApiService } from '../services/api.service';

@Injectable({
	providedIn: 'root'
})
export class StoryMapper {
	apiService: ApiService;

	constructor(
		apiService: ApiService
	) {
		this.apiService = apiService;
	}

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
				console.log('response data', data)
				
				data.forEach(async storyData => {

					let user: IUser = await me.fetchUser(storyData.by);
					console.log('user', user);

					let story: IStory = {
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
				});
			})
		
			console.log('END');

			stories.sort(this.sortStoriesByScore());

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

		console.log('fetchUser return');

		return user;
	}

	private sortStoriesByScore() {
		return function(a: any, b: any) {
			if (a['score'] > b['score']) {
				return 1;
			}
			else if (a['score'] < b['score']) {
				return -1;
			}
			else {
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
}