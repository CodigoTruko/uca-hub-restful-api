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
import { Comment } from './models/entities/comment.schema';
import { eventResponseMapper } from './event.utils';

@Injectable()
export class EventService{
    private readonly logger = new Logger(EventService.name);
    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Community.name) private communityModel: Model<Community>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        ){}
    
    async createProfileEvent(event: CreateEventDto, user){
        const createdEvent = await new this.eventModel(event).save();
        this.logger.log(createdEvent)
        const userFound = await this.userModel.findOne({ _id: user }).exec()
        userFound.posts.splice(0,0, createdEvent)
        await userFound.save()
    }
    
    async getEventsFromProfile(user, documentsToSkip=0, limitOfDocuments = 20){

        const results = await this.userModel.findOne({ _id: user})
            .populate({
                path: "posts",
                select: "title description",
                populate: {
                    path: "author",
                    model: "User",
                    select: "_id name username carnet"
                }
            })
            .exec()
        
        console.log(results.posts)

        const mappedResults = eventResponseMapper(results.posts);
            
        if(documentsToSkip){
            return { count: results.posts.length, results: mappedResults.posts.slice(documentsToSkip, documentsToSkip+limitOfDocuments) }
        }
        return { count: results.posts.length, results: mappedResults.posts.slice(0, limitOfDocuments) }
        
    }  

    async getCommentsFromEvent(id){
        const event = await this.eventModel.findOne({ _id: id})
            .populate({
                path: "comments",
                select: "message",
                populate: {
                    path: "author",
                    model: "User",
                    select: "_id name username carnet"
                }
            })
            .exec()

        return { count: event.comments.length, results: event.comments}
    }

    async createComment(id, comment){
        const createdComment = await new this.commentModel(comment).save();

        const event = await this.eventModel.updateOne({_id: id}, {$push: { comments: { _id: createdComment.id}}});
        return { createdComment, event}
    }

    async deleteComment(event, comment){

        const query = await this.eventModel.updateOne({_id: event}, {$pull: { comments: comment}});
        return { query }
    }

    async toggleEventLike(event, user){
        const eventFound = await this.eventModel.findOne({ _id: event}).exec()

        const index = eventFound.likes.findIndex( _u => _u == user)

        if(index < 0){
            eventFound.likes.splice(0,0,user)
        }else{
            eventFound.likes.splice(index, 1)
        }
        

        return await eventFound.save()
    }

    async getEventLikes(event, documentsToSkip, limitOfDocuments){
        const results = await this.eventModel.findOne({_id: event}, { likes: { $slice: [ documentsToSkip, limitOfDocuments+documentsToSkip-1 ] } } )
            .populate("likes", "_id name carnet username")
            .exec()
        return results
    }

    async createCommunityEvent(event: CreateEventDto, name){
        const createdEvent = await new this.eventModel(event).save();
        this.logger.log(createdEvent);
        const communityUpdated =  await this.communityModel.updateOne({name: name}, { $push: { posts: { _id: createdEvent._id }}})
        this.logger.log(communityUpdated)
    }

    async getEventsFromCommunity(name, documentsToSkip = 0, limitOfDocuments = 20){
        
        const results =  await this.communityModel.findOne({name: name}, { posts: { $slice:[documentsToSkip, limitOfDocuments+documentsToSkip-1 ] } })
            .sort({ createdAt: -1})
            .populate({
                path: "posts",
                select: "title description",
                populate: {
                    path: "author",
                    model: "User",
                    select: "_id name username carnet"
                }
            });
        
        const mappedResults = eventResponseMapper(results.posts)
        return mappedResults;
    }

    async getFeed(id, documentsToSkip = 0, limitOfDocuments?: number){
        const user = await this.userModel.findOne({ _id: id }).exec();
        this.logger.debug(user)
        console.log(user.follows)

        let authorsForFeed = user.follows

        authorsForFeed.push(user)

        const feedResults = this.eventModel.find(
            { author: { $in: authorsForFeed} },
            {
                visibility: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
            )
            .sort({ createdAt: -1})
            .skip(documentsToSkip)
            .populate("author", "name username carnet");

        
        
        if(limitOfDocuments) { feedResults.limit(limitOfDocuments)}

        const results = await feedResults.exec()
        console.log(results)
        
        const mappedResults = eventResponseMapper(results)

        return { count: results.length, results: mappedResults, };
    }

    async createEvent(event){
        await new this.eventModel(event).save()
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
        
        const mappedResults = eventResponseMapper(results)

        return { mappedResults, count };
    }

    async findAllVisibleEvents(skip?: number, limit?: number){
        return await this.eventModel.find({visibility: true}).skip(skip).limit(limit).exec();
    }

    async findEventById(id: String){
        const event = await this.eventModel.findOne({ _id: id}).exec()
        return event
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