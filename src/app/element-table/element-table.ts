import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Subject } from 'rxjs';
import { EditComponent } from '../edit-component/edit-component';
import { Console } from 'console';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-element-table',
  standalone: false,
  templateUrl: './element-table.html',
  styleUrl: './element-table.css',
})


export class ElementTable implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource: PeriodicElement[] = [];
  filteredData: PeriodicElement[] = [];
  lastFilterValue: string = '';
  private filterSubject = new Subject<string>();

  constructor(private dialog: MatDialog,private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.dataSource = [];
    this.filteredData = [];

    setTimeout(() => {
      this.dataSource = [...ELEMENT_DATA];
      this.filteredData = [...this.dataSource];
      this.filterSubject.next(this.lastFilterValue);
      this.isLoading = false;

      
      this.cdr.detectChanges();
    }, 1000);

    this.filterSubject.pipe(
      debounceTime(2000)
    ).subscribe(value => {
      this.lastFilterValue = value;
      this.applyFilter(value);
    });
  }


  onFilterInput(value: string): void {
    this.filterSubject.next(value);
  }

  applyFilter(filterValue: string) {
    const filter = filterValue.trim().toLowerCase();
    if (!filter) {
      this.filteredData = [...this.dataSource];
    } else {
      this.filteredData = this.dataSource.filter(el =>
        el.name.toLowerCase().includes(filter) ||
        el.symbol.toLowerCase().includes(filter) ||
        el.weight.toString().includes(filter) ||
        el.position.toString().includes(filter)
      );
    }
    this.cdr.detectChanges();
  }

  editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '300px',
      data: { ...element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.findIndex(e => e.position === result.position);
        if (index !== -1) {
          this.dataSource[index] = result;
          this.applyFilter(this.lastFilterValue); 
        }
      }
      
    });
} 



}
