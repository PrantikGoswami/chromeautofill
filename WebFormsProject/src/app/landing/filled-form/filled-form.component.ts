import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-filled-form',
  templateUrl: './filled-form.component.html',
  styleUrls: ['./filled-form.component.css']
})
export class FilledFormComponent implements OnInit {
  filledFormGroup: FormGroup;
  //userId = 1824;
  //profile: any;
  paymentTypes: any;
  outputText: string;
  pageTitle: string;
  //falseis = true;
  isInvalid = false;

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

  err_pin: boolean;
  err_lanmark: boolean;
  err_radio: boolean;
  err_lastname: boolean;
  err_email: boolean;
  err_check: boolean;
  err_phone: boolean;
  err_profession: boolean;
  err_range: boolean;
  err_description: boolean;
  err_country: boolean;


  constructor(private router: Router, private appServ: AppService) { }

  ngOnInit() {
    this.paymentTypes = [{"name":"Prantik"},{"name":"Korok"}]
    //this.onSelect(this.paymentTypes); 
    // let checkboxArray = new FormArray([
    //   new FormControl(true),
    //   new FormControl(false),
    //   new FormControl(true)]);
    this.showCorrectValues();
    let msg = "Correct Value = ";
	this.filledFormGroup = new FormGroup({
	  firstname: new FormControl(this.corr_firstname.replace(/'/gi,"").replace(msg,"")),
	  lastname: new FormControl(this.err_lastname ? 'trtr' : this.corr_lastname.replace(/'/gi,"").replace(msg,"")),
	  address: new FormControl(this.corr_address.replace(/'/gi,"").replace(msg,"")),
	  country: new FormControl(this.err_country ? '' : this.corr_country.replace(/'/gi,"").replace(msg,"")),
	  pin: new FormControl(this.err_pin ? '000' : this.corr_pin.replace(/'/gi,"").replace(msg,"")),
	  email: new FormControl(this.err_email ? 'fdgfdg' : this.corr_email.replace(/'/gi,"").replace(msg,"")),
    profession: new FormControl(this.err_profession ? 'test' : this.corr_profession.replace(/'/gi,"").replace(msg,"")),
    landmark: new FormControl(this.err_lanmark ? 'fdgg' : this.corr_landmark.replace(/'/gi,"").replace(msg,"")),
    mobile: new FormControl(this.err_phone ? '000' : this.corr_phone.replace(/'/gi,"").replace(msg,"")),
    city: new FormControl(this.corr_city.replace(/'/gi,"").replace(msg,"")),
    state: new FormControl(this.corr_state.replace(/'/gi,"").replace(msg,"")),
    //state: new FormControl("West Bengaly",[this.forbiddenNameValidator("West Bengal")]),
    radioFormGroup:  new FormGroup({
      gender: new FormControl(this.err_radio ? 'werewr' : this.corr_radioFormGroup.replace(/'/gi,"").replace(msg,"").toLowerCase())
    }),
    checkboxFormGroup: new FormGroup({
      car: new FormControl(this.err_check ? false : this.corr_checkboxFormGroup.replace(/'/gi,"").replace(msg,"")=='car'),
      bike: new FormControl(this.err_check ? false : this.corr_checkboxFormGroup.replace(/'/gi,"").replace(msg,"")=='bike'),
      boat: new FormControl(this.err_check ? false : this.corr_checkboxFormGroup.replace(/'/gi,"").replace(msg,"")=='boat')
    }),
    range: new FormControl(Number(this.err_range ? '0' : this.corr_range.replace(/'/gi,"").replace(msg,""))),
    description: new FormControl(this.err_description ? '' : this.corr_description.replace(/'/gi,"").replace(msg,"")),
    experimenter: new FormControl(
    (this.appServ.getFilledOrBlank()=='filledform'?'ff':'bl')
    +"-"+(this.appServ.getVoiceOrNoVoice()=='voice'?'v':'nv')
    +"-"+this.appServ.getSelectedExpForm()
    +"-"+this.appServ.getExperimenter()
    )
  });
  this.pageTitle="Filled Form";
  // this.filledFormGroup.statusChanges.subscribe(val =>{
  //   this.pageTitle="Filled Form" + this.filledFormGroup.valid;
  // })
  //console.log(this.filledFormGroup);
  //this.showCorrectValues();
  }

  onSelect(code:any){
      console.log(code);
  }

  forbiddenNameValidator(nameRe: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = (nameRe != control.value);
      //console.log("is forbidden="+forbidden);
      this.isInvalid = forbidden;
      return false ? {'forbiddenName': {value: control.value}} : null;
    };
  }

  submit(){
    console.log(this.filledFormGroup.valid);
    if(this.filledFormGroup.valid){
      this.outputText = "Details saved successfully !";
      this.router.navigate(['/'+this.appServ.getVoiceOrNoVoice()+'/'+'experiment']);
    }
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
      this.err_pin = true;
      this.err_lanmark = true;
      this.err_radio = true;
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
      this.err_lastname = true;
      this.err_profession = true;
      this.err_check = true;
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
      this.err_phone = true;
      this.err_range = true;
      this.err_email = true;
    }
    if(this.appServ.getSelectedExpForm() == 'e2'){
      this.corr_description = "Give any description";
      this.corr_range = msg+"'36'";
      this.corr_checkboxFormGroup = msg+"'boat'";
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
      this.err_description = true;
      this.err_radio = true;
      this.err_check = true;
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
      this.err_country = true;
      this.err_range = true;
      this.err_check = true;
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
      this.err_description = true;
      this.err_email = true;
      this.err_radio = true;
    }
  }
}