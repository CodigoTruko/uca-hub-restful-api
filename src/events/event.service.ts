import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './models/entities/event.schema';
import { Model } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import {Request} from 'express'

@Injectable()
export class EventService{
    private readonly logger = new Logger(EventService.name);
    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @Inject(REQUEST) private readonly request: Request
        ){}
    
    async createEvent(createEventDto: CreateEventDto): Promise<EventDocument>{
        const createdEvent = new this.eventModel(createEventDto);
        this.logger.log(createdEvent);
        return await createdEvent.save();
    }

    async findAllEvents(documentsToSkip = 0, limitOfDocuments?: number){
        const query = this.eventModel
            .find({})
            .sort({ _id: 1 })
            .skip(documentsToSkip);
        
        if (limitOfDocuments) {
            query.limit(limitOfDocuments);
        }
        const results = await query.exec();
        const count = await this.eventModel.count();
       
        return { results, count };
    }

    //TODO: Mucha mierda. todo el crud basicamente
    async findAllVisibleEvents(skip?: number, limit?: number){
        return await this.eventModel.find({visibility: true}).skip(skip).limit(limit).exec();
    }

    async findEventById(id: String){
        // return this.events.find(_event => _event.id === id);
    }

    async updateEvent(id: String, updateEventDto: UpdateEventDto){
        /* const {title, description, category, visibility} = updateEventDto;
        const eventToUpdate = this.events.find(_event => _event.id == id);

        eventToUpdate.title = title;
        eventToUpdate.description = description;
        eventToUpdate.category = category;
        eventToUpdate.visibility = visibility;

        return eventToUpdate; */
    }

    async deleteEvent(id: String){
        await this.eventModel.findByIdAndDelete(id);
    }

    async toggleEventVisibility(id: String){
        /* const eventFound = this.events.find(_event => _event.id === id);
        // Just toggle
        eventFound.visibility = !eventFound.visibility; */
    }
}