export class CreateCarroDto {
  placa: string;
  modelo?: string;
  cor?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleteAt?: Date;
}

export class CreateMoradorDto {
  nome: string;
  bloco?: string;
  apartamento: string;
  carro?: CreateCarroDto;
  createdAt?: Date;
  updatedAt?: Date;
  deleteAt?: Date;
}
