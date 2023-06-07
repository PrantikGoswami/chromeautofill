import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  landingForm: FormGroup;
  pageTitle: string;
  outputText:string;
  constructor(private router: Router, private appServ: AppService) { }

  ngOnInit() {
    this.landingForm = new FormGroup({
      name: new FormControl()
    });
    this.pageTitle = "Landing Form";
    this.landingForm.controls.name.valueChanges.subscribe(value =>{
      this.outputText = "";
    })
  }

  toNoVoice(){
    if(this.landingForm.controls.name.value != null){
      this.appServ.setExperimenter(this.landingForm.controls.name.value);
      this.appServ.setVoiceOrNoVoice('noVoice');
      this.router.navigate(['/noVoice']);
    }else{
      this.outputText = "Name required !";
    }
    
  }

  toVoice(){
    if(this.landingForm.controls.name.value != null){
      this.appServ.setExperimenter(this.landingForm.controls.name.value);
      this.appServ.setVoiceOrNoVoice('voice');
      this.router.navigate(['/voice']);
    }else{
      this.outputText = "Name required !";
    }
  }
}