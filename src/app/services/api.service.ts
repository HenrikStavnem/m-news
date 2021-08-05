import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { IStory } from '../interfaces/story';
//import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Injectable()
export class ApiService {

	constructor(private http: HttpClient) {
		/*
		const storiesUrl: string = 'https://hacker-news.firebaseio.com/v0/topstories.json',
			storyUrl: string = 'https://hacker-news.firebaseio.com/v0/item/${id}.json',
			userUrl: string = 'https://hacker-news.firebaseio.com/v0/user/${id}.json';
		*/
	}

	getStories() {
		return this.http.get<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
	}

	getStoryData(id: number) {
		return this.http.get<IStory>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
	}
}