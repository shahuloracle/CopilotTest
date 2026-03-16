import { Component, EventEmitter, Input, OnInit, Output, Signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
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

interface IUom {
    id: number;
    code: string;
    name: string;
}


@Component({
    selector: 'app-add-uom',
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
        ConfirmDialogModule
    ],
    templateUrl: './add-uom.html',
    styleUrl: './add-uom.scss',
    providers: [MessageService, ConfirmationService]
})
export class AddUom implements OnInit {
    @Input() uom!: IUom;
    @Input() uomList!: Signal<IUom[]>;
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    submitted = false;
    isCodeDuplicate = false;

    constructor(private _productService: ProductService) {}

    ngOnInit() {}

    saveUom() {
        this.submitted = true;
        this.isCodeDuplicate = false;

        if (!this.uom?.code?.trim() || !this.uom?.name?.trim()) {
            return;
        }

        const normalizedCode = this.uom.code.trim().toLowerCase();
        this.isCodeDuplicate = this.uomList().some(
            (item) => item.code?.trim().toLowerCase() === normalizedCode && item.id !== this.uom.id
        );

        if (this.isCodeDuplicate) {
            return;
        }

        const request$ = this._productService.saveUom(this.uom);

        request$.subscribe(
            () => {
                this.visibleChange.emit(false);
                this.submitted = false;
                this.isCodeDuplicate = false;
            },
            (error) => {
                console.error('Error saving uom', error);
            }
        );
    }

    onCodeChange() {
        this.isCodeDuplicate = false;
    }

    hideDialog() {
        this.visibleChange.emit(false);
        this.submitted = false;
        this.isCodeDuplicate = false;
    }
}
