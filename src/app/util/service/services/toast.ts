import { Injectable } from "@angular/core";
import { Message } from "src/app/model/model";
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class Toast {
    public showSuccess(message: Message): void {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: message.success,
            text: message.message,
            showConfirmButton: false,
            timer: 5000
        });
    }

    private message = new Message();
    public showError(error: any): void {
        if (error.status == 504) {
            this.message.success = error.status;
            this.message.message = error.statusText;
            this._showError(this.message)
        } else {
            this.message.success = "Failed"
            this.message.message = error.error.message;
            this._showError(this.message)
        }
        this._showError(this.message)
    }

    private _showError(message: Message): void {
        Swal.fire({
            position: 'center',
            icon: 'error',
            text: message.message,
            title: message.success,
            showConfirmButton: false,
            timer: 10000
        });
    }

    public incompleteForm1(errorLabels: string[]): void {
        Swal.fire({
            icon: "warning",
            html: `
                Please ensure following fields are captured</b>,
                <br><br>
                 <ul style="list-style-type: none;  padding: 0;margin: 0;">
                 ${this.getInvalidLabelsHtml(errorLabels)}
                </ul> 
            `,
            confirmButtonColor: "#87342E",
            showCancelButton: false,
            showConfirmButton: true,
            customClass: {
                confirmButton: 'no-border'
            }

        });
        /*Swal.fire({icon:'warning',title:'Form Incomplete',
            text:'Please ensure all mandatory fields are filled',
            timer:5000,showConfirmButton:false})*/
    }

    public incompleteForm(): void {
        Swal.fire({
            icon: 'warning', title: 'Form Incomplete',
            text: 'Please ensure all mandatory fields are filled',
            timer: 5000, showConfirmButton: false
        })
    }

    private getInvalidLabelsHtml(errorLabels: string[]): string {
        return errorLabels.map(label => `<li style="display: column;align-text:left;">${label.replace(/\:$/, "").trim()}</li>`).join('');
    }


    showErrorInSweetAlert(formErrors: { accordion: string, errors: string[] }[]) {
        const firstError = formErrors[0];

        let errorListHTML = '<ul style="list-style-type: none; padding-left: 0;">';
        errorListHTML += `<li><span style="font-weight: bold; font-size: 18px;">${firstError.accordion}</span><ul style="list-style-type: none; padding-left: 0;">`;

        firstError.errors.forEach((err) => {
            errorListHTML += `<li style="list-style-type: none; padding-left: 0;">- ${err}</li>`;
        });

        errorListHTML += `</ul></li></ul>`;

        Swal.fire({
            title: 'Form Errors',
            html: errorListHTML,
            icon: 'warning',
            confirmButtonText: 'Close',
            confirmButtonColor: "#87342E",
            heightAuto: false,
            customClass: {
                popup: 'custom-popup', // Custom class for the popup
                htmlContainer: 'custom-html-container' // Custom class for the HTML container
            },
            didOpen: () => {
                const container = document.querySelector('.custom-popup') as HTMLElement;
                if (container) {
                    container.scrollTop = 0; // Scroll to the top when the dialog opens
                }
            }
        });
    }

}