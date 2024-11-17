import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  form: FormGroup;
  generatedNumber: string = '';
  private timerSubscription: Subscription | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      endingNumber: [
        '',
        [Validators.required, Validators.min(0), Validators.max(9)],
      ],
      numberLength: ['', [Validators.required, Validators.min(0)]],
    });
  }

  generateNumber(): void {
    if (this.form.invalid) return;

    const { endingNumber, numberLength } = this.form.value;
    const length = numberLength - 1;
    this.generatedNumber = this.randomDigits(length) + endingNumber.toString();

    this.startTimer(length, endingNumber);
  }

  private randomDigits(length: number): string {
    return Array.from({ length })
      .map(() => Math.floor(Math.random() * 10))
      .join('');
  }

  private startTimer(length: number, endingNumber: number): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(5000).subscribe(() => {
      this.generatedNumber =
        this.randomDigits(length) + endingNumber.toString();
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}