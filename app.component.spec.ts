import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('endingNumber')?.value).toBe('');
    expect(component.form.get('numberLength')?.value).toBe('');
  });

  it('should display validation error for endingNumber if invalid', () => {
    const endingNumberControl = component.form.get('endingNumber');
    endingNumberControl?.setValue(10); 
    endingNumberControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('small'));
    expect(endingNumberControl?.invalid).toBeTrue();
  });

  it('should display validation error for numberLength if invalid', () => {
    const numberLengthControl = component.form.get('numberLength');
    numberLengthControl?.setValue(-1); 
    numberLengthControl?.markAsTouched();
    fixture.detectChanges();

    expect(numberLengthControl?.invalid).toBeTrue();
  });

  it('should generate a number when form is valid', () => {
    component.form.get('endingNumber')?.setValue(5);
    component.form.get('numberLength')?.setValue(3);
    component.generateNumber();

    expect(component.generatedNumber).toMatch(/^\d{2}5$/); 
  });

  it('should disable the submit button if form is invalid', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    component.form.get('endingNumber')?.setValue('');
    fixture.detectChanges();

    expect(buttonElement.nativeElement.disabled).toBeTrue();
  });

  it('should enable the submit button if form is valid', () => {
    component.form.get('endingNumber')?.setValue(5);
    component.form.get('numberLength')?.setValue(3);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.disabled).toBeFalse();
  });

  it('should regenerate number every 5 seconds after submission', fakeAsync(() => {
    component.form.get('endingNumber')?.setValue(5);
    component.form.get('numberLength')?.setValue(3);
    component.generateNumber();
    const firstGeneratedNumber = component.generatedNumber;

    tick(5000); 
    expect(component.generatedNumber).not.toEqual(firstGeneratedNumber);

    tick(5000); 
    const secondGeneratedNumber = component.generatedNumber;
    expect(secondGeneratedNumber).not.toEqual(firstGeneratedNumber);
    expect(secondGeneratedNumber).not.toEqual(component.generatedNumber);
  }));

  it('should stop the timer when component is destroyed', () => {
    const unsubscribeSpy = spyOn(component['timerSubscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
