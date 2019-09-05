import { environment } from 'src/environments/environment';
import { Project } from './../models/models-classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class ProjectsService {
    constructor(private http: HttpClient) {

    }

    getProjects(){
        return this.http.get<Project[]>(environment.apiUrl+"/api/projects");
    }

}