import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-blank-form',
  templateUrl: './blank-form.component.html',
  styleUrls: ['./blank-form.component.css']
})
export class BlankFormComponent implements OnInit {
  blankFormGroup: FormGroup;
  //userId = 1824;
  //profile: any;
  paymentTypes: any;
  outputText: string;
  pageTitle: string;
  //falseis = true;

  corr_description: string;
  corr_range: string;
  corr_checkboxFormGroup: string;
  corr_radioFormGroup: string;
  corr_state: string;
  corr_city: string;
  corr_phone: string;
  corr_landmark: string;
  corr_profession: string;
  corr_email: string;
  corr_pin: string;
  corr_country: string;
  corr_address: string;
  corr_lastname: string;
  corr_firstname: string;


  constructor(private router: Router, private appServ: AppService) { }

  ngOnInit() {
    this.paymentTypes = [{"name":"Prantik"},{"name":"Korok"}]
    //this.onSelect(this.paymentTypes); 
	this.blankFormGroup = new FormGroup({
	  first_name: new FormControl(""),
	  payment_account_holder: new FormControl(""),
	  payment_company: new FormControl(""),
	  payment_iban: new FormControl(""),
	  payment_bic: new FormControl(""),
	  payment_type: new FormControl(""),
    sepa_agree: new FormControl(""),
    experimenter: new FormControl(
      (this.appServ.getFilledOrBlank()=='filledform'?'ff':'bl')
      +"-"+(this.appServ.getVoiceOrNoVoice()=='voice'?'v':'nv')
      +"-"+this.appServ.getSelectedExpForm()
      +"-"+this.appServ.getExperimenter()
      )
  });
  this.pageTitle="Blank Form";
  this.showCorrectValues();
  }
  onSelect(code:any){
      console.log(code);
  }
  submit(){
    this.outputText = "Details saved successfully !";
    this.router.navigate(['/'+this.appServ.getVoiceOrNoVoice()+'/'+'experiment']);
  }

  onSubmit(){
    
  }
  
  filledForm(){
    this.router.navigate(['/noVoice'])
  }

  blankForm(){
    this.router.navigate(['/voice'])
  }
  showCorrectValues(){
    let msg = "Correct Value = ";
    if(this.appServ.getSelectedExpForm() == 't1'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'20'";
      this.corr_checkboxFormGroup = msg+"'bike'";
      this.corr_radioFormGroup = msg+"'Male'";
      this.corr_state = msg+"'Watford'";
      this.corr_city = msg+"'Surrey'";
      this.corr_phone = msg+"'5213961394'";
      this.corr_landmark = msg+"'School'";
      this.corr_profession = msg+"'student'";
      this.corr_email = msg+"'harry.potter@hogwarts.com'";
      this.corr_pin = msg+"'RG12 9FG'";
      this.corr_country = msg+"'United Kingdom'";
      this.corr_address = msg+"'4, Privet Drive'";
      this.corr_lastname = msg+"'Potter'";
      this.corr_firstname = msg+"'Harry'";
    }
    if(this.appServ.getSelectedExpForm() == 't2'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'25'";
      this.corr_checkboxFormGroup = msg+"'boat'";
      this.corr_radioFormGroup = msg+"'Female'";
      this.corr_state = msg+"'Florida'";
      this.corr_city = msg+"'River Heights'";
      this.corr_phone = msg+"'1286659805'";
      this.corr_landmark = msg+"'Police Station'";
      this.corr_profession = msg+"'detective'";
      this.corr_email = msg+"'nancy.drew@sleuth.com'";
      this.corr_pin = msg+"'07101'";
      this.corr_country = msg+"'USA'";
      this.corr_address = msg+"'69, Seeawl Lane'";
      this.corr_lastname = msg+"'Drew'";
      this.corr_firstname = msg+"'Nancy'";
    }
    if(this.appServ.getSelectedExpForm() == 'e1'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'35'";
      this.corr_checkboxFormGroup = msg+"'car'";
      this.corr_radioFormGroup = msg+"'Male'";
      this.corr_state = msg+"'England'";
      this.corr_city = msg+"'London'";
      this.corr_phone = msg+"'1747503639'";
      this.corr_landmark = msg+"'Hospital'";
      this.corr_profession = msg+"'detective'";
      this.corr_email = msg+"'sherlock@gov.uk'";
      this.corr_pin = msg+"'NW1 6XE'";
      this.corr_country = msg+"'United Kingdom'";
      this.corr_address = msg+"'221B, Baker Street'";
      this.corr_lastname = msg+"'Holmes'";
      this.corr_firstname = msg+"'Sherlock'";
    }
    if(this.appServ.getSelectedExpForm() == 'e2'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'36'";
      this.corr_checkboxFormGroup = msg+"'car'";
      this.corr_radioFormGroup = msg+"'Male'";
      this.corr_state = msg+"'England'";
      this.corr_city = msg+"'London'";
      this.corr_phone = msg+"'0112634888'";
      this.corr_landmark = msg+"'Library'";
      this.corr_profession = msg+"'doctor'";
      this.corr_email = msg+"'johnw@beingdoctor.com'";
      this.corr_pin = msg+"'NW1 6XE'";
      this.corr_country = msg+"'United Kingdom'";
      this.corr_address = msg+"'221B, Baker Street'";
      this.corr_lastname = msg+"'Watson'";
      this.corr_firstname = msg+"'John'";
    }
    if(this.appServ.getSelectedExpForm() == 'e3'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'38'";
      this.corr_checkboxFormGroup = msg+"'bike'";
      this.corr_radioFormGroup = msg+"'Male'";
      this.corr_state = msg+"'New York'";
      this.corr_city = msg+"'Gotham'";
      this.corr_phone = msg+"'1122334478'";
      this.corr_landmark = msg+"'Hospital'";
      this.corr_profession = msg+"'CEO'";
      this.corr_email = msg+"'batbruce@rich.com'";
      this.corr_pin = msg+"'07001'";
      this.corr_country = msg+"'USA'";
      this.corr_address = msg+"'1007 Mountain Drive'";
      this.corr_lastname = msg+"'Wayne'";
      this.corr_firstname = msg+"'Bruce'";
    }
    if(this.appServ.getSelectedExpForm() == 'e4'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'40'";
      this.corr_checkboxFormGroup = msg+"'car'";
      this.corr_radioFormGroup = msg+"'Male'";
      this.corr_state = msg+"'Florida'";
      this.corr_city = msg+"'Miami'";
      this.corr_phone = msg+"'0112276899'";
      this.corr_landmark = msg+"'Laboratory'";
      this.corr_profession = msg+"'drug lord'";
      this.corr_email = msg+"'escobar@netflix.com'";
      this.corr_pin = msg+"'33140'";
      this.corr_country = msg+"'USA'";
      this.corr_address = msg+"'5860 North Bay Road'";
      this.corr_lastname = msg+"'Escobar'";
      this.corr_firstname = msg+"'Pablo'";
    }
  }
}