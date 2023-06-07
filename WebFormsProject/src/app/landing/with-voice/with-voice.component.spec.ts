import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithVoiceComponent } from './with-voice.component';

describe('WithVoiceComponent', () => {
  let component: WithVoiceComponent;
  let fixture: ComponentFixture<WithVoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithVoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
