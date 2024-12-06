import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
})
export class SeatsComponent implements OnInit {
  seats: any[] = [];
  organizedSeats: any[] = [];
  isLoading = true;
  errorMessage = '';
  travelId: string | null = null;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.travelId = this.route.snapshot.queryParamMap.get('travelId');

    if (this.travelId) {
      this.fetchSeats();
    } else {
      this.errorMessage = 'Nenhum ID de viagem fornecido.';
      this.isLoading = false;
    }
  }

  fetchSeats() {
    const apiUrl = '/api/new/seats';
    const username = 'teste_dev3';
    const password = 'WhOnBcjTsGseYDE9819GloHYhgL';

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    };

    const body = {
      travelId: this.travelId,
      orientation: 'horizontal',
      type: 'matriz',
    };

    this.http.post<any[]>(apiUrl, body, { headers }).subscribe(
      (response) => {
        this.seats = response;
        this.organizeSeats();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Erro ao carregar os assentos.';
        console.error('Erro ao buscar assentos:', error);
        this.isLoading = false;
      }
    );
  }

  organizeSeats() {
    const floors = new Map<number, any[][]>();

    this.seats.forEach((seat) => {
      const floor = seat.position.z || 0;
      const x = seat.position.x;
      const y = seat.position.y;

      if (!floors.has(floor)) {
        floors.set(floor, []);
      }

      const floorMatrix = floors.get(floor)!;

      if (!floorMatrix[x]) {
        floorMatrix[x] = [];
      }
      floorMatrix[x][y] = seat;
    });

    this.organizedSeats = Array.from(floors.entries()).map(([floor, matrix]) => ({
      floor,
      matrix,
    }));
  }
}
