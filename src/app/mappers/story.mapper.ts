import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IStory } from '../interfaces/story';
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
				
				data.forEach(storyData => {
					let story: IStory = {
						id: storyData.id,
						by: storyData.by,
						score: storyData.score,
						time: storyData.time,
						type: storyData.type,
						url: storyData.url,
						title: storyData.title,
						image: me.pickRandomHeaderImage()
					};

					stories.push(story);
				});
			})
		
			console.log('END');
			return stories;
	}

	pickRandomHeaderImage(): string {
		const images = [
			'card-header-01.jpg',
			'card-header-02.jpg',
			'card-header-03.jpg',
			'card-header-04.jpg'
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

	private getUser() {

	}
}