import { PartialType } from '@nestjs/mapped-types';
import { CreatePorteiroDto } from './create-morador.dto';

export class UpdatePorteiroDto extends PartialType(CreatePorteiroDto) {}
