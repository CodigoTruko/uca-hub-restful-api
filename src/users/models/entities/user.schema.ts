import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, VirtualType } from "mongoose";
import { Community } from "src/communities/models/entities/community.schema";
import { Event } from "src/events/models/entities/event.schema";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Logger } from "@nestjs/common";

export type UserDocument = HydratedDocument<User>

//https://github.com/MarioMartinez00072520/workalize-uca/blob/main/models/User.model.js
//https://docs.nestjs.com/security/encryption-and-hashing
@Schema({ 
    timestamps: true,
/*     toJSON: {
        virtuals: true,
    }, */
 })
export class User {
    @Prop({required: true})
    name: String;
    @Prop({required: true})
    carnet: String;
    @Prop({required: true})
    username: String;
    @Prop({required: true})
    email: String;
    @Prop()
    password: String;
    @Prop()
    salt: String;
    @Prop()
    tokens: String[];
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}]})
    bookmarks: Event[];
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Community"}]})
    subscriptions: Community[];
/*     encryptPassword: Function;
    makeSalt: Function;
    comparePassword: Function; */
}

const UserSchema = SchemaFactory.createForClass(User)
/* 
UserSchema.methods.encryptPassword = async function(password){
    const logger = new Logger(User.name)
    if(!password) return "";
    try {
        logger.verbose(this.salt)
        logger.verbose(password)
        const hashedPassword = await bcrypt.hash(password, this.salt)
        return hashedPassword;
    } catch (error) {
        logger.debug({error})
        return "";
    }
}

UserSchema.methods.makeSalt =  async function(){
    return await bcrypt.genSalt()
}

UserSchema.methods.comparePassword = async function(password){
    const logger = new Logger(User.name)
    logger.debug(password)
    logger.debug(this.hashedPassword)
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch;
}

UserSchema.virtual("hashedPassword")
    .set(async function (this: UserDocument, password: string = randomBytes(10).toString()){
        const logger = new Logger(User.name)
        if(!password) return;
        this.salt = await this.makeSalt();
        logger.debug(this.salt)
        logger.debug(this.password)   
});
 */
export { UserSchema };