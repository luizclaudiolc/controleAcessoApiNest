import { PartialType } from '@nestjs/mapped-types';
import { CreatePorteiroDto } from './create-porteiro.dto';

export class UpdatePorteiroDto extends PartialType(CreatePorteiroDto) {}
