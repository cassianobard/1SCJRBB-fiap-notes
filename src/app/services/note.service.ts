import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note, NewNote } from './@types/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl: string;

  private newNoteSource = new Subject<Note>();
  newNoteProvider = this.newNoteSource.asObservable();

  private editNoteSource = new Subject<Note>();
  editNoteProvider = this.editNoteSource.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://fiap-notes-api.herokuapp.com';
  }

  notifyNewNoteAdded(note: Note) {
    this.newNoteSource.next(note);
  }

  notifyEditNote(note: Note) {
    this.editNoteSource.next(note);
  }

  getNotes() {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  removeNote(noteId: number) {
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  postNotes(newNote: NewNote) {
    return this.http.post<Note>(`${this.apiUrl}/notes`, newNote);
  }

  editNote(note: Note) {
    return this.http.put<Note>(`${this.apiUrl}/notes/${note.id}`, { text: note.text });
  }
}
