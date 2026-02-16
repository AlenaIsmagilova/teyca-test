import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LayoutComponent } from './layout.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  template: '<div data-testid="clients-stub">Clients stub</div>',
})
class ClientsPageStubComponent {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, ClientsPageStubComponent],
    })
      .overrideComponent(LayoutComponent, {
        set: {
          imports: [ClientsPageStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with title', () => {
    const header = fixture.debugElement.query(By.css('.header'));
    const title = fixture.debugElement.query(By.css('.icon-text'));

    expect(header).toBeTruthy();
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('База знаний');
  });

  it('should render clients page child component', () => {
    const child = fixture.debugElement.query(By.css('app-clients-page'));
    expect(child).toBeTruthy();
  });
});
