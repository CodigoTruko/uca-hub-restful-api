import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './models/entities/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventService{
    private readonly logger = new Logger(EventService.name);
    constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}
    
    async createEvent(createEventDto: CreateEventDto): Promise<EventDocument>{
        const createEvent = new this.eventModel(createEventDto);
        this.logger.log(createEvent);
        return await createEvent.save();
    }

    async findAllEvents(){
        return await this.eventModel.find().exec();
    }

    //TODO: Mucha mierda. todo el crud basicamente
    async findAllVisibleEvents(){
        // return this.events.filter(_event => _event.visibility === true);
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