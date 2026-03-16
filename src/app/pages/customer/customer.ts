import { Component, signal } from '@angular/core';
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
import { Observable } from 'rxjs';
import { AddCustomer } from './add-customer/add-customer';
import { ProductService } from '../service/product.service';

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ICustomer{
    id:      number;
    name:    string;
    address: string;
    phone:   string;
}

@Component({
  selector: 'app-category',
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
        ConfirmDialogModule,
        AddCustomer
    ],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
  providers: [MessageService,ConfirmationService,ProductService]
})
export class Customer {

    selectedcustomer!: ICustomer[] | null;
    customerList = signal<ICustomer[]>([]);
    statuses!: any[];
    cols!: Column[];
    exportColumns!: ExportColumn[];
    customer! : ICustomer ;
    visible = false;




    constructor(private _productService:ProductService)
    {

           this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'name', header: 'Customer' },
            { field: 'address', header: 'Address' },
            { field: 'phone', header: 'Phone No.' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

        this.loadCustomers();
  
    
  
  }

  loadCustomers() {
        this._productService.getCustomers().subscribe({
            next: (data) => {
                this.customerList.set(data.data);
                console.log('Customer List:', this.customerList());
            },
            error: (error) => {
                console.error('Error fetching getCustomer Details:', error);
            }
        });
    }



  onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

  openNew() {
        this.customer = {id:0} as ICustomer;
        this.visible = true;
    }

  onVisibleChange(value: boolean) {
        this.visible = value;
        if (!value) {
        this.loadCustomers();
        }
    }

    editCustomer(customer: ICustomer) {
      this.customer = { ...customer };
      this.visible = true;
    }

    deleteCustomer(customer: ICustomer) {
        customer.name = 'delete';
      this._productService.saveCustomer(customer).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
        }
      });
    }

}
