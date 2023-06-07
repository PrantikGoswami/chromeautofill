import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-without-voice',
  templateUrl: './without-voice.component.html',
  styleUrls: ['./without-voice.component.css']
})
export class WithoutVoiceComponent implements OnInit {
  withoutVoiceForm: FormGroup;
  pageTitle: string;
  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
  this.withoutVoiceForm = new FormGroup({});
  this.pageTitle="Without Voice Form"
  }


  filledForm(){
    this.appService.setFilledOrBlank('filledform');
    this.router.navigate(['/noVoice/experiment'])
  }

  blankForm(){
    this.appService.setFilledOrBlank('blankform');
    this.router.navigate(['/noVoice/experiment'])
  }
}