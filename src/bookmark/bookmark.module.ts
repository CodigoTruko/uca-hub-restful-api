import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Bookmark, BookmarkSchema } from "./models/entities/bookmark.schema";
import { Mongoose } from "mongoose";

@Module({
    imports: [MongooseModule.forFeature([{
        name: Bookmark.name,
        schema: BookmarkSchema
    }])]
})
export class BookmarkModule{

}