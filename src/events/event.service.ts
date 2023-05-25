import { Injectable, Logger } from '@nestjs/common';
import { Event } from './models/interface/event.interface';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';

@Injectable()
export class EventService{
    private readonly logger = new Logger(EventService.name);
    private readonly events: Event[] = [
        {
            id: "1",
            title: "CONIA UCA 2023",
            description: "Engineering and Architecture Congress hosted by UCA",
            category: "STEM",
            visibility: true
        },
        {
            id: "2",
            title: "Humanities Festival",
            description: "Festival hosted by the Faculty of Humanities and Arts where students can showcase their work",
            category: "Humanities",
            visibility: true
        },
        {
            id: "3",
            title: "Web3 & Ethereum Conference",
            description: "Conference from a member of the Ethereum Foundation",
            category: "CRYPTO",
            visibility: true

        }
    ]

    
    createEvent(createEventDto: CreateEventDto){
        const {id, title, description, category} = createEventDto;
        const eventToAdd: Event = {
            id: id,
            title: title,
            description: description,
            category: category,
            visibility: true
        }
        this.logger.debug(eventToAdd);
        this.events.push(eventToAdd);
    }

    /*
    createEvent(createEventDto: CreateEventDto){
        this.events.push({createEventDto, visibility: true});
    }
    */

    findAllEvents(): Event[]{
        return this.events;
    }

    findAllVisibleEvents(): Event[]{
        return this.events.filter(_event => _event.visibility === true);
    }

    findEventById(id: String): Event{
        return this.events.find(_event => _event.id === id);
    }

    updateEvent(id: String, updateEventDto: UpdateEventDto){
        const {title, description, category, visibility} = updateEventDto;
        const eventToUpdate = this.events.find(_event => _event.id == id);

        eventToUpdate.title = title;
        eventToUpdate.description = description;
        eventToUpdate.category = category;
        eventToUpdate.visibility = visibility;

        return eventToUpdate;
    }

    toggleEventVisibility(id: String){
        const eventFound = this.events.find(_event => _event.id === id);
        // Just toggle
        eventFound.visibility = !eventFound.visibility;
    }
}