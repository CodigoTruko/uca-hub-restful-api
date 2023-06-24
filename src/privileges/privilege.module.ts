import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Privilege, PrivilegeSchema } from "./models/entities/privilege.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Privilege.name, schema: PrivilegeSchema}])],
    controllers: [],
    providers: [],
})
export class PrivilegeModule{}