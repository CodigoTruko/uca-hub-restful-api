import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './models/dto/createEventDto';
import { UpdateEventDto } from './models/dto/updateEventDto';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './models/entities/event.schema';
import { Model } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import {Request} from 'express'
import { User } from 'src/users/models/entities/user.schema';
import { Community } from 'src/communities/models/entities/community.schema';

@Injectable()
export class EventService{
    private readonly logger = new Logger(EventService.name);
    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Community.name) private communityModel: Model<Community>,
        ){}
    
    async createProfileEvent(event: CreateEventDto, user){
        const createdEvent = await new this.eventModel(event).save();
        this.logger.log(createdEvent)
        const userUpdated =  await this.userModel.updateOne({_id: user}, {$push: { posts: {_id: createdEvent._id} }})
        this.logger.log(userUpdated)
    }
    
    async getEventsFromProfile(user, documentsToSkip=0, limitOfDocuments = 20){
        const userPostsToCount = await this.userModel.findOne({ _id: user})

        const results = await this.userModel.findOne({ _id: user}, { posts: { $slice: [documentsToSkip, limitOfDocuments+documentsToSkip]}})
            .sort({createdAt: -1})
            .populate("posts", "title description author")
        return {count: userPostsToCount.postsCount, results: results.posts}
    }  

    async createCommunityEvent(event: CreateEventDto, name){
        
        const createdEvent = await new this.eventModel(event).save();
        this.logger.log(createdEvent);
        const communityUpdated =  await this.communityModel.updateOne({name: name}, { $push: { posts: { _id: createdEvent._id }}})
        this.logger.log(communityUpdated)
    }

    async getEventsFromCommunity(name, documentsToSkip = 0, limitOfDocuments = 20){
        const communityPostsToCount = await this.communityModel.findOne({ name: name });
        
        const results =  await this.communityModel.findOne({name: name}, { posts: { $slice:[documentsToSkip, limitOfDocuments+documentsToSkip ] } })
            .sort({ createdAt: -1})
            .populate("posts", "title description author" );
        

        return { count: communityPostsToCount.postsCount, results: results.posts} ;
    }

    async getFeed(id, documentsToSkip = 0, limitOfDocuments?: number){
        const user = await this.userModel.find({ _id: id }).exec();
        const follows = user.map( user => user.follows);

        const feedCount = this.eventModel.find({ author: [follows]})
            .sort({ createdAt: -1})
            .populate("author", "name username");

        const feedResults = this.eventModel.find({ author: [follows]})
            .sort({ createdAt: -1})
            .skip(documentsToSkip)
            .populate("author", "name username");

        if(limitOfDocuments) { feedResults.limit(limitOfDocuments)}
        
        return { count: await feedCount.count(), results: await feedResults.exec(), };
    }

    async findAllEvents(documentsToSkip = 0, limitOfDocuments?: number){
        const query = this.eventModel
            .find({})
            .sort({ createdAt: -1 })
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