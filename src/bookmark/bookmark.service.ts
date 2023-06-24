import {  Injectable, Logger } from "@nestjs/common";
import { CreateBookmarkDto } from "./models/dtos/createBookmarkDto";
import { InjectModel } from "@nestjs/mongoose";
import { Bookmark } from "./models/entities/bookmark.schema";
import { Model } from "mongoose";
import { User } from "src/users/models/entities/user.schema";
import { Event } from "src/events/models/entities/event.schema";
import { UserService } from "src/users/user.service";
import { EventService } from "src/events/event.service";

@Injectable()
export class BookmarkService{
    private readonly logger = new Logger(BookmarkService.name);

    constructor(
        @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
        @InjectModel(User.name) private userModel: Model<User>,
        private userService: UserService,
        @InjectModel(Event.name) private eventModel: Model<Event>,
        private eventService: EventService
    ){}
}