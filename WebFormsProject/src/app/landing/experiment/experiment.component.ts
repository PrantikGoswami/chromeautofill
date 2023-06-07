import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {
  experimentForm: FormGroup;
  pageTitle: string;
  constructor(private router: Router, private appServ: AppService) { }

  ngOnInit() {
	this.experimentForm = new FormGroup({});
  this.pageTitle="Choose Experiment Type";
  }
  
  openForm(expType:string){
    this.appServ.setSelectedExpForm(expType);
    this.router.navigate(['/'+this.appServ.getVoiceOrNoVoice()+'/'+expType+'/'+this.appServ.getFilledOrBlank()])
  }

  blankForm(){
    this.router.navigate(['/voice/blankform'])
  }
}