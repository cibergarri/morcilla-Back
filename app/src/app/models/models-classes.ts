
export class User{
    status: string;
    _id:string;
    name: string;
    photo?: string;
    email?:string;
}

export class QuestionLite{
    _id: string;
    topic: string;
    text: string;
    user: string;
    createdAt:string;
}

export class Question{
    _id: string;
    topic: TopicReference;
    text: string;
    user: UserReference;
    createdAt:string;
}

export class NewQuestion{
    text:string;
    topic?:string;
}

export class TopicReference {
    _id: string;
    title: string;
}

export class UserReference{
    _id: string;
    name?:string;
    photo?:string;
}

export class Answer{
    _id: string;
    text:string;
    question: string;
    createdAt: string;
    user:UserReference;
}

export class Topic{
    _id: string;
    title:string;
    description: string;
}

export class PushNotification{
    type?:string = "push";
    title:string;
    body:string;
}

export class QuestionSearch{
    topicId: string;
    text:string;
}

export class Project{
    _id: string;
    name: string;
}