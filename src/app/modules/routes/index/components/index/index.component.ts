import { Component, OnInit } from "@angular/core";
import { IStory } from "src/app/interfaces/story";
import { StoryMapper } from "src/app/mappers/story.mapper";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	storyMapper: StoryMapper = new StoryMapper(this.apiService);
	storyIds: number[] = [];
	stories: IStory[] = [];

	constructor(
		private apiService: ApiService
	) {}

	ngOnInit(): void {
		this.getStories();
	}

	private async getStories() {
		

	
		console.log('before');
		await this.storyMapper.getStories().then(stories => {
			console.log('FINAL', stories);
			this.stories = stories;
		});
		console.log('after');

		/*
		this.apiService.getStories().subscribe((storyIds: number[]) => {
			console.log('data', storyIds);
			this.getStoryData(storyIds)
		},
		error => {
			console.error('API error', error);
		},
		() => {
			console.log('Finally');
		});
		*/
	}

	private getStoryData(stories: number[]) {
		//this.storyMapper.mapStories(stories);
	}
}