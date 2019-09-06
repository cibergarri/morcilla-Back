
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
    accepted:boolean;
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
    question?:string;
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

export class UserStats{
    answers:StatAnswers;
    questions:number;
    workingHours: StatWorkingHours;
}

export class StatWorkingHours{
    total: StatTimeTotal;
    totalsByProject: any; //key-val StatTimeTotal
}

export class StatTimeTotal{
    hours: number;
    minutes:number;
    name?:string;
}


export class StatAnswers{
    total:number;
    accepted:number;
}

export class StatLevel{
    level:number;
    color:string;
    amount:number;
    title:string;
}

export class StatLevelResult{
    level:StatLevel;
    nextAmount:number;
}