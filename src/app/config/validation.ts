import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateCallNumber(control: AbstractControl): { [key: string]: any } | null {
    const phoneNumberRegex = /^(?:\+27|0)(\d{2})\d{3}\d{4}$/;
    const number = control.value
    
    if(!number)
      return null;
    
    const isValid = phoneNumberRegex.test(control.value);
    return isValid ? null : { 'invalidPhoneNumber': true };
}

export function validateHomeTel(control: AbstractControl): { [key: string]: any } | null { 
  const phoneNumberRegex = /^(041|043|047|045|048|046|049|051|057|058|056|011|012|016|010|031|033|034|036|035|039|015|013|017|014|018|053|054|027|021|044|023)\d{7}$/;
 
  if(control.value ==='')
    return null;
  
  const isValid = phoneNumberRegex.test(control.value);
  return isValid ? null : { 'invalidHomeNumber': true };
}
export function validateBusinessTel(control: AbstractControl): { [key: string]: any } | null { 
  const phoneNumberRegex = /^(041|043|047|045|048|046|049|051|057|058|056|011|012|016|010|031|033|034|036|035|039|015|013|017|014|018|053|054|027|021|044|023)\d{7}$/;
 
  if(control.value ==='')
    return null;
  
  const isValid = phoneNumberRegex.test(control.value);
  return isValid ? null : { 'invalidBusinessTel': true };
}

export function idNumberValidator1(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const idNumber = control.value;
    if (!idNumber) {
      return null; // No validation if the field is empty
    }

    const idRegex = /^(\d{2})(\d{2})(\d{2})\d{7}$/;
    if (!idRegex.test(idNumber)) {
      return { invalidIdNumber: 'Invalid ID number format' };
    }

    const year = parseInt(idNumber.substring(0, 2), 10);
    const month = parseInt(idNumber.substring(2, 4), 10);
    const day = parseInt(idNumber.substring(4, 6), 10);

    // Assuming ID numbers are for people born in 1900-2099
    const currentYear = new Date().getFullYear();
    const fullYear = year + (year > currentYear % 100 ? 1900 : 2000); 

    const isValidMonth = month >= 1 && month <= 12;

    // Check if the day is valid for the given month and year
    const date = new Date(fullYear, month - 1, day);
    const isValidDay = date.getFullYear() === fullYear && date.getMonth() === month - 1 && date.getDate() === day;

    if (!isValidMonth || !isValidDay) {
      return { invalidIdNumber: 'Invalid date of birth in ID number' };
    }

    return null;
  };
}

export function validateId2(control: AbstractControl): { [key: string]: any } | null { 
  const IdRegex = /^\d{13}$/;
  if(control.value ==='')
    return null;

  const isValid = IdRegex.test(control.value);
  return isValid ? null : { 'invalidIdNumber': true };
}1

export function ageValidator(control: AbstractControl): Promise<{ [key: string]: any } | null> {
    return new Promise(resolve => {
        const age = control.value;
        if (age < 18) {
            resolve({ 'underAge': true });
        } else {
            resolve(null);
        }
    });
}

export function formatDateToISO(dateInput: any): string | null {
  let dateObject = dateInput;

  if (!(dateObject instanceof Date)) {
    dateObject = new Date(dateObject);
    if (!isNaN(dateObject.getTime())) {
      return dateObject.toISOString().split('T')[0];
    } else {
      console.error("Invalid date provided:", dateInput);
      return null;
    }
    
  }
  return null;
}


export function gazetteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
     
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate <= today ? null : { futureDate: true };
  };
}


export function maxValueValidator(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && value !== '' && (isNaN(value) || value > max)) {
        return { maxValue: { maxValue: max } };
      }
      return null;
    };
  }

  export function ageValidator2(minAge: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = control.value;
      if (!age || isNaN(age)) {
        return null; // Not validating empty value or non-number
      }
      return age >= minAge ? null : { underAge: true };
    };
  }

  export function latitudeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      if (value === null || value === '') {
        return null;  
      }
      const latitude = parseFloat(value);
      if (isDecimal(value) && latitude >= -34 && latitude <= -30) {
        return null;  
      }
      return { 'invalidLatitude': true }; 
    };
  }
  export function longitudeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value;
      if (value === null || value === '') {
        return null;  
      }
      const longitude = parseFloat(value);
      if (isDecimal(value) && longitude >= 24 && longitude <= 34) {
        return null; 
      }
      return { 'invalidLongitude': true }; 
    };
  }

  function isDecimal(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

export function idNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const id = control.value;
    
    if (!id) {
      return null;
    }
    
    // Check if the ID is exactly 13 digits long and only digits
    if (!/^\d{13}$/.test(id)) {
      return { 'idNumberInvalid': true };
    }
    
    // Extract the date part
    const datePart = id.substring(0, 6);
    
    // Check if the date part is a valid date
    const year = +datePart.substring(0, 2);
    const month = +datePart.substring(2, 4);
    const day = +datePart.substring(4, 6);
    
    // Date validation logic
    const currentYear = new Date().getFullYear();
    const fullYear = year >= 0 && year <= (currentYear % 100) ? 2000 + year : 1900 + year;
    
    const isValidDate = (d: number, m: number, y: number): boolean => {
      const date = new Date(y, m - 1, d);
      return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y;
    };
    
    if (!isValidDate(day, month, fullYear)) {
      return { 'idNumberInvalidDate': true };
    }

    return null;
  };
}

export function maxValueValidator2(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value !== null && value !== '') {
      const numValue = parseFloat(value);

      if (isNaN(numValue) || numValue < min || numValue > max) {
        return {
          range: {
            min: min,
            max: max
          }
        };
      }
    }

    return null;
  };
}

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    if (age !== null && age < minAge) {
      return { underage: true };
    }
    return null;
  };
}

