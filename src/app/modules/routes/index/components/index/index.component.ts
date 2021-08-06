import { Component, OnInit } from "@angular/core";
import { IStory } from "src/app/interfaces/story";
import { StoryMapper } from "src/app/mappers/story.mapper";

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	storyMapper: StoryMapper = new StoryMapper();
	storyIds: number[] = [];
	stories: IStory[] = [];

	ngOnInit(): void {
		this.getStories();
	}

	private async getStories() {		
		await this.storyMapper.getStories().then(stories => {
			this.stories = stories;
		});
	}
}