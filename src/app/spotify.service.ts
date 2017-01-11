import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
//import { Subject } from 'rxjs/Subject';

const config = require('../../config');

@Injectable()
export class SpotifyService {
  private API_ENDPOINT: string = 'http://localhost:4201/api'
  constructor(private http: Http) { }

  auth() {
    console.log("STARTING AUTH PROCESS");
    return this.http.get(`${this.API_ENDPOINT}/authenticate`)
    .map(res => res.json());
    //let headers = new Headers({ 'Access-Control-Allow-Origin': 'http://localhost:4200',
      //'Authorization': 'Basic ' + (new Buffer(config.spotify.clientID + ':' + config.spotify.clientSecret).toString('base64'))
    //});

    //let options = new RequestOptions({ headers: headers });
    //return this.http.get(`https://accounts.spotify.com/api/token`, options)
    //.map((res) => { this.extractData(res)});
  }
  private extractData(res: Response) {
    //let body = res.json();
    //console.log("body in extractData: ", body);
     //return body.data || { };
  }
  //getContacts() {
    //return this.http.get(`${this.API_ENDPOINT}/contacts`)
      //.map((res) => { return res.json(); })
      //.map((data) => { return data.items; });
  //}

  //getContact(id: number | string) {
    //return this.http.get(`${this.API_ENDPOINT}/contacts/${id}`)
      //.map(res => res.json().item);
  //}

  //updateContact(contact: Contact) {
    //return this.http.put(`${this.API_ENDPOINT}/contacts/${contact.id}`, contact);
  //}

  //search(term: string) {
    //return this.http.get(`${this.API_ENDPOINT}/search?text=${term}`)
      //.map((res) => { return res.json(); })
      //.map((data) => { return data.items; });
  //}

}
