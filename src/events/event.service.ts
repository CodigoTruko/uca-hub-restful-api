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
        userFound.save()
        // const userUpdated =  await this.userModel.updateOne({_id: user}, {$push: { posts: {_id: createdEvent._id} }})
        //this.logger.log(userUpdated)
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
        
        if(documentsToSkip){
            return { count: results.posts.length, results: results.posts.slice(documentsToSkip, documentsToSkip+limitOfDocuments) }
        }
        return { count: results.posts.length, results: results.posts.slice(0, limitOfDocuments) }
        
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

        const event = await this.eventModel.updateOne({_id: id}, {$push: { comments: { _id: createdComment.id}}})
        return { createdComment, event}
    }

    async deleteComment(event, comment){

        const query = await this.eventModel.updateOne({_id: event}, {$pull: { comments: comment}})
        return { query }
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
        

        return { count: communityPostsToCount.postsCount, results: results.posts};
    }

    async getFeed(id, documentsToSkip = 0, limitOfDocuments?: number){
        const user = await this.userModel.findOne({ _id: id }).exec();
        console.log(user)
        console.log(user.follows)
        const feedCount = this.eventModel.find({ author: { $in: user.follows}})
            .sort({ createdAt: -1})
            .populate("author", "name username");

        const feedResults = this.eventModel.find(
            { author: { $in: user.follows} },
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

        const count = await feedCount.count()
        console.log(count)
        const results = await feedResults.exec()
        console.log(results)

        return { count: count, results: results, };
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
       
        return { results, count };
    }

    //TODO: Mucha mierda. todo el crud basicamente
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