import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilledFormComponent } from './filled-form.component';

describe('FilledFormComponent', () => {
  let component: FilledFormComponent;
  let fixture: ComponentFixture<FilledFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilledFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilledFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
