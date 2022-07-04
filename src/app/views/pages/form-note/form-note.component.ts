import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Note, NewNote } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';
  checkoutForm: FormGroup;
  subscription: Subscription;
  note = {} as Note;

  constructor(private formBuilder: FormBuilder, private noteService: NoteService) {
    this.checkoutForm = this.formBuilder.group({
      noteId: [''],
      noteText: ['', [Validators.required, Validators.minLength(5)]],
      noteUrgent: [false],
    });
    this.subscription = this.noteService.editNoteProvider.subscribe({
      next: (note: Note) => {
        this.note = note;
        this.checkoutForm.setValue({
          noteId: note.id,
          noteText: note.text,
          noteUrgent: note.urgent || false,
        });
      },
    });
  }

  ngOnInit(): void {}

  sendNote() {
    if (this.checkoutForm.valid) {
      if (!this.checkoutForm.value.noteId) {
        this.createNote();
      } else {
        this.editNote();
      }
    }
  }

  createNote() {
    const newNote: NewNote = {
      text: this.checkoutForm.value.noteText,
      urgent: this.checkoutForm.value.noteUrgent,
    };

    this.noteService.postNotes(newNote).subscribe({
      next: (note) => {
        this.resetForm();
        this.noteService.notifyNewNoteAdded(note);
      },
      error: (error) => alert(`Erro ao criar nova nota: ${error.error.erro}`),
    });
  }

  editNote() {
    this.note.text = this.checkoutForm.value.noteText;
    this.note.urgent = this.checkoutForm.value.noteUrgent;

    this.noteService.editNote(this.note).subscribe({
      next: () => this.resetForm(),
      error: (error) => alert(`Erro ao atualizar a nota: ${error.error.erro}`),
    });
  }

  resetForm() {
    this.checkoutForm.reset();
    this.note = {} as Note;
  }

  get noteId() {
    return this.checkoutForm.get('noteId');
  }
  get noteText() {
    return this.checkoutForm.get('noteText');
  }
  get noteUrgent() {
    return this.checkoutForm.get('noteUrgent');
  }
}
