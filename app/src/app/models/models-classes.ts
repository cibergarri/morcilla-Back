
export class QuestionLite{
    _id: string;
    topic: string;
    text: string;
    user: string;
}

export class Question{
    _id: string;
    topic: TopicReference;
    text: string;
    user: UserReference;
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
    name:string;
}

export class Answer{
    _id: string;
    text:string;
    question: string;
    user:string;
}

export class Topic{
    _id: string;
    title:string;
    description: string;
}