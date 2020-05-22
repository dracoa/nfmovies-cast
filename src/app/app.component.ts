import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import * as Hls from 'hls.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    url: new FormControl('https://www.nfmovies.com/video/?41670-1-0.html', Validators.required)
  });
  selectedSource: string;
  urls = [
    'https://youku.cdn4-okzy.com/20191126/2980_2373c5f5/index.m3u8',
    'https://youku.cdn4-okzy.com/20191126/2980_2373c5f5/1000k/hls/index.m3u8'
  ];
  loading = false;
  hls: any;
  @ViewChild('video', {static: true})
  video: ElementRef;

  constructor(private http: HttpClient) {

  }

  selectSource(url: string) {
    this.hls.loadSource(url);
  }

  loadUrls() {
    this.loading = true;
    this.urls = [];
    this.http.post('extract', {
      url: this.form.get('url').value,
      matcher: '\\.m3u8'
    }).pipe(finalize(() => this.loading = false))
      .subscribe((val: any) => {
        this.urls = val.result;
      }, error => alert(error));
  }

  ngOnInit(): void {
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.attachMedia(this.video.nativeElement);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('video and hls.js are now bound together !');
      });
    }
  }


}
