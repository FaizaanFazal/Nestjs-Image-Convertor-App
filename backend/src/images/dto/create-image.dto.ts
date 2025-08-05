import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    originalName: string;

    @IsString()
    @IsNotEmpty()
    format: string;

    @IsNumber()
    size: number;

    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    targetFormat: string;
}
