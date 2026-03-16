import { Component, Input, Output, EventEmitter, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductService } from '../../service/product.service';



interface ICustomer{
    id:      number;
    name:    string;
    address: string;
    phone:   string;
}

@Component({
  selector: 'app-add-customer',
  imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
  providers: [MessageService,ConfirmationService]
})
export class AddCustomer implements OnInit {

@Input() customer! : ICustomer;
@Input() visible: boolean = false;
@Output() visibleChange = new EventEmitter<boolean>();

submitted: boolean = false;

constructor(private _productService: ProductService)
{
  console.log('i am called da');
}

ngOnInit() {
}

saveCustomer()
{
    this.submitted = true;
    const request$ = this._productService.saveCustomer(this.customer);

    request$.subscribe(
        () => {
            this.visibleChange.emit(false);
            this.submitted = false;
        },
        (error) => {
            console.error('Error saving customer', error);
        }
    );
}


hideDialog()
{
    this.visibleChange.emit(false);
    this.submitted = false;
}


}
