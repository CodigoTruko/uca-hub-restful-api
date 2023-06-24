import { Min } from "class-validator";

export class Pagination{
    @Min(0)
    count: number;
    next: string = null;
    previous: string = null;
    results: [];
}