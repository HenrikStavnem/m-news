import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IStory, IUserRich } from "src/app/interfaces/story";
import { StoryMapper } from "src/app/mappers/story.mapper";

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	user: IUserRich;
	userId: string;
	storyMapper: StoryMapper = new StoryMapper();
	submittedStories: IStory[];

	constructor(
		private route: ActivatedRoute
	) { }
	
	ngOnInit(): void {

		this.route.paramMap.subscribe(params => {			
			const paramId: string | null = params.get('id');

			this.userId = paramId ? paramId : "";

			if (this.userId !== "") {
				this.storyMapper.getUser(this.userId).then(user => {
					console.log(user);

					this.user = user;

					this.storyMapper.getUserStories(user.submitted).then(stories => {
						this.submittedStories = stories;
					})
				});
			}
		})
	}
}