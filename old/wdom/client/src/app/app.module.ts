import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
	MdToolbarModule,
	MdIconModule,
	MdButtonModule,
	MdSidenavModule,
	MdListModule,
	MdCardModule,
	MdInputModule,
	MdSnackBarModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OtherUsersPipe } from './user.pipe';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';
import { HomeComponent } from './home.component';
import { GameComponent } from './game.component';

@NgModule({
	declarations: [
		AppComponent,
		OtherUsersPipe,
		HomeComponent,
		GameComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpModule,
		MdToolbarModule,
		MdIconModule,
		MdButtonModule,
		MdSidenavModule,
		MdListModule,
		MdCardModule,
		MdInputModule,
		MdSnackBarModule,
		AppRoutingModule
	],
	providers: [HttpService, SocketService],
	bootstrap: [AppComponent]
})
export class AppModule { }
