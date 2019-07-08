import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'otherUsers' })
export class OtherUsersPipe implements PipeTransform {
	transform(users: string[], self: string, owner: string) {
		return users.filter(item => (item !== self) && (item !== owner));
	}
}