import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseEdit } from 'src/app/pages/base/base-edit.component';
import { Login } from 'src/models/login-register/login';
import { Router } from '@angular/router';
import { Utils } from 'src/shared/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-show-component',
  templateUrl: './movie-show.component.html',
  styleUrls: ['./movie-show.component.scss']
})
export class MovieShowComponent extends BaseEdit<Login> implements OnInit {
  constructor(
    protected utils: Utils,
    protected router: Router,
    private location: Location) {
    super(router, utils);
  }

  movieLink: string;
  showingVideo: boolean;
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;

  ngOnInit(): void {
    this.movieLink = this.dataReceived.movieLink;
    if (!this.movieLink)
      this.goBack();
  }

  goBack = () => this.location.back();

  startVideo = () => {
    this.videoPlayer.nativeElement[this.showingVideo ? 'play' : 'pause']();
    this.showingVideo = !this.showingVideo;
  }
}
