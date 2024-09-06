import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMediaComponent } from './modal-media.component';

describe('ModalMediaComponent', () => {
  let component: ModalMediaComponent;
  let fixture: ComponentFixture<ModalMediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalMediaComponent]
    });
    fixture = TestBed.createComponent(ModalMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
