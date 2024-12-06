import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  isLoading = true;
  errorMessage = '';
  fromId: string | null = null;
  toId: string | null = null;
  travelDate: string | null = null;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    this.fromId = queryParams.get('from');
    this.toId = queryParams.get('to');
    this.travelDate = queryParams.get('partida');

    if (this.fromId && this.toId && this.travelDate) {
      this.fetchResults();
    } else {
      this.errorMessage = 'Filtros insuficientes para realizar a busca.';
      this.isLoading = false;
    }
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }

  formatTravelDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600); // Calcula as horas
    const minutes = Math.floor((durationInSeconds % 3600) / 60); // Calcula os minutos

    if (minutes === 0) {
      return `${hours}h de viagem`;
    }

    return `${hours}h ${minutes}m de viagem`;
  }

  fetchResults() {
    const apiUrl = '/api/new/search';
    const username = 'teste_dev3';
    const password = 'WhOnBcjTsGseYDE9819GloHYhgL';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    };

    const body = {
      from: this.fromId,
      to: this.toId,
      travelDate: this.travelDate,
      affiliateCode: 'DDE',
      'include-connections': true,
    };

    this.http.post<any[]>(apiUrl, body, { headers }).subscribe(
      (response) => {
        this.results = response;
        this.fetchCompanyDetails();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erro ao carregar resultados. Tente novamente.';
        console.error('Erro ao buscar resultados:', error);
        this.isLoading = false;
      }
    );
  }

  fetchCompanyDetails() {
    const username = 'teste_dev3';
    const password = 'WhOnBcjTsGseYDE9819GloHYhgL';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    };

    this.results.forEach((result, index) => {
      const companyId = result.company.id;
      const companyApiUrl = `/api/companies/${companyId}`;

      this.http.get<any>(companyApiUrl, { headers }).subscribe(
        (companyDetails) => {
          if (companyDetails && companyDetails.logo) {
            this.results[index].company.logo =
              companyDetails.logo.jpg ||
              companyDetails.logo.svg ||
              result.company.name;
          } else {
            this.results[index].company.logo = result.company.name;
          }
        },
        (error) => {
          console.error(error);
          this.results[index].company.logo = result.company.name;
        }
      );
    });
  }

  goToSeats(travelId: string) {
    this.router.navigate(['/poltrona'], { queryParams: { travelId } });
  }
}
