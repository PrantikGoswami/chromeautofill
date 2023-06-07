import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  private selectedExpForm:string;
  private voiceOrNoVoice:string;
  private filledOrBlank:string;
  private experimenter:string;


  setSelectedExpForm(formName:string){
    this.selectedExpForm = formName;
  }
  getSelectedExpForm():string{
    return this.selectedExpForm;
  }

  setVoiceOrNoVoice(formName:string){
    this.voiceOrNoVoice = formName;
  }
  getVoiceOrNoVoice():string{
    return this.voiceOrNoVoice;
  }

  setFilledOrBlank(formName:string){
    this.filledOrBlank = formName;
  }
  getFilledOrBlank():string{
    return this.filledOrBlank;
  }

  setExperimenter(formName:string){
    if(formName != null)
      this.experimenter = formName.replace(" ","");
  }
  getExperimenter():string{
    return this.experimenter;
  }
}
