import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Privilege } from "./models/entities/privilege.schema";
import { Model } from "mongoose";

@Injectable()
export class PrivilegeService {
    private readonly logger = new Logger(PrivilegeService.name);
    constructor(@InjectModel(Privilege.name) private privilegeModel: Model<Privilege>) {}
}