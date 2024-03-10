import { ComponentFixture, TestBed } from '@angular/core/testing';

import { messagesListComponent } from './messages-list.component';

describe('messagesListComponent', () => {
  let component: messagesListComponent;
  let fixture: ComponentFixture<messagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [messagesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(messagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
