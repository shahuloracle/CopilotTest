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
import { AddUom } from './add-uom/add-uom';
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

interface IUom {
    id: number;
    code: string;
    name: string;
}

@Component({
    selector: 'app-uom',
    standalone: true,
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
        AddUom
    ],
    templateUrl: './uom.html',
    styleUrls: ['./uom.scss'],
    providers: [MessageService, ConfirmationService, ProductService]
})
export class Uom {
    selectedUom!: IUom[] | null;
    uomList = signal<IUom[]>([]);
    statuses!: any[];
    cols!: Column[];
    exportColumns!: ExportColumn[];
    uom!: IUom;
    visible = false;

    constructor(private _productService: ProductService) {
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
        this.loadUoms();
    }

    loadUoms() {
        this._productService.getUoms().subscribe({
            next: (data) => {
                this.uomList.set(data.data);
                console.log('UOM List:', this.uomList());
            },
            error: (error) => {
                console.error('Error fetching getUom Details:', error);
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.uom = { id: 0, code: '', name: '' };
        this.visible = true;
    }

    onVisibleChange(value: boolean) {
        this.visible = value;
        if (!value) {
            this.loadUoms();
        }
    }

    editUom(uom: IUom) {
        this.uom = { ...uom };
        this.visible = true;
    }

    deleteUom(uom: IUom) {
        uom.name = 'delete';
        this._productService.saveUom(uom).subscribe({
            next: () => {
                this.loadUoms();
            },
            error: (error) => {
                console.error('Error deleting uom:', error);
            }
        });
    }
}
