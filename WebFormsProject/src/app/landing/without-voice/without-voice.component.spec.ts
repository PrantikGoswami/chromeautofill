import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutVoiceComponent } from './without-voice.component';

describe('WithoutVoiceComponent', () => {
  let component: WithoutVoiceComponent;
  let fixture: ComponentFixture<WithoutVoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithoutVoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
