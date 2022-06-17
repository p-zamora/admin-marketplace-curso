import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoresComponent } from './edit-stores.component';

describe('EditStoresComponent', () => {
  let component: EditStoresComponent;
  let fixture: ComponentFixture<EditStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
