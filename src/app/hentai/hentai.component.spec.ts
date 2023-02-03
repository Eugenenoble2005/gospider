import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HentaiComponent } from './hentai.component';

describe('HentaiComponent', () => {
  let component: HentaiComponent;
  let fixture: ComponentFixture<HentaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HentaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HentaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
