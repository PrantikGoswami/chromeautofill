import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-with-voice',
  templateUrl: './with-voice.component.html',
  styleUrls: ['./with-voice.component.css']
})
export class WithVoiceComponent implements OnInit {
  voiceForm: FormGroup;
  pageTitle: string;
  constructor(private router: Router, private appService: AppService) { }

  ngOnInit() {
	this.voiceForm = new FormGroup({});
  this.pageTitle="Voice Form";
  }
  
  filledForm(){
    this.appService.setFilledOrBlank('filledform');
    this.router.navigate(['/voice/experiment'])
  }

  blankForm(){
    this.appService.setFilledOrBlank('blankform');
    this.router.navigate(['/voice/experiment'])
  }
}