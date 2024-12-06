import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClient } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    ButtonModule,
    CalendarModule,
    AutoCompleteModule,
    FloatLabelModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  date: Date | undefined;
  stops: any[] = [];
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];
  selectedFrom: any;
  selectedTo: any;
  isLoading: boolean = false; // Estado de loading
  results: any[] = []; // Armazena os resultados da busca
  errorMessage: string = ''; // Armazena mensagens de erro

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadStops();
  }

  loadStops() {
    const apiUrl = '/api/stops';
    const username = 'teste_dev3';
    const password = 'WhOnBcjTsGseYDE9819GloHYhgL';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    };

    this.http.get<any[]>(apiUrl, { headers }).subscribe(
      (data) => {
        this.stops = data;
      },
      (error) => {
        console.error('Erro ao carregar paradas:', error);
      }
    );
  }

  searchFrom(event: any) {
    const query = event.query.toLowerCase();
    this.fromSuggestions = this.stops.filter((stop) =>
      stop.name.toLowerCase().includes(query)
    );
  }

  searchTo(event: any) {
    const query = event.query.toLowerCase();
    this.toSuggestions = this.stops.filter((stop) =>
      stop.name.toLowerCase().includes(query)
    );
  }

  swapLocations() {
    const temp = this.selectedFrom;
    this.selectedFrom = this.selectedTo;
    this.selectedTo = temp;
  }

  private router = inject(Router);

  // searchTickets() {
  //   if (!this.selectedFrom || !this.selectedTo || !this.date) {
  //     this.errorMessage = 'Todos os campos são obrigatórios.';
  //     return;
  //   }

  //   this.isLoading = true; // Ativa o loading
  //   this.errorMessage = ''; // Limpa mensagens de erro

  //   const apiUrl = '/api/new/search';
  //   const body = {
  //     from: this.selectedFrom.id,
  //     to: this.selectedTo.id,
  //     travelDate: this.date.toISOString().split('T')[0],
  //     affiliateCode: 'DDE',
  //     'include-connections': true,
  //   };

  //   const username = 'teste_dev3';
  //   const password = 'WhOnBcjTsGseYDE9819GloHYhgL';
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //     Authorization: 'Basic ' + btoa(`${username}:${password}`),
  //   };

  //   this.http.post<any[]>(apiUrl, body, { headers }).subscribe(
  //     (response) => {
  //       this.results = response; // Armazena os resultados
  //       this.isLoading = false; // Desativa o loading
  //     },
  //     (error) => {
  //       this.errorMessage = 'Erro ao buscar passagens. Tente novamente.';
  //       console.error('Erro ao buscar passagens:', error);
  //       this.isLoading = false; // Desativa o loading
  //     }
  //   );
  // }

  searchTickets() {
    if (!this.selectedFrom || !this.selectedTo || !this.date) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      return;
    }

    const fromId = this.selectedFrom.id;
    const toId = this.selectedTo.id;
    const formattedDate = this.date.toISOString().split('T')[0];

    this.router.navigate(['/onibus'], {
      queryParams: {
        from: fromId,
        to: toId,
        partida: formattedDate,
      },
    });
  }
}
