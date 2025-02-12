import {ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Firestore, collection, query, where, collectionData, orderBy, addDoc} from '@angular/fire/firestore';
import {Observable, take} from 'rxjs';
import {Message} from '../../../models/message.model';
import {AsyncPipe, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {getAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule,DatePipe],
  styles: []
})
export class ChatComponent implements OnInit {
  datePipe = inject(DatePipe);
  newMessage!: string;
  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  public messages$!: Observable<Message[]>;
  public chatId!: string;
  public selectedFile?: File;
  auth = getAuth();
  public currentUserId!: string;
  @ViewChild('scrollableDiv') private scrollableDiv!: ElementRef
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  ngOnInit(): void {
    this.currentUserId = this.auth.currentUser?.uid || '';
    this.chatId = this.route.snapshot.paramMap.get('id') || '';
    if (this.chatId) {
      this.loadMessages();
      this.messages$.subscribe(() => {
        this.scrollToBottom();
      });
    }
  }

  convertDate(dateString: string): string | null {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'EE d MM y à HH:mm', 'fr-FR');
  }
  private loadMessages(): void {
    const messagesRef = collection(this.firestore, 'messages');
    const messagesQuery = query(
      messagesRef,
      where('conversationId', '==', this.chatId),
      orderBy('timestamp', 'asc')
    );

    this.messages$ = collectionData(messagesQuery, {idField: 'id'}) as Observable<Message[]>;
    this.messages$.subscribe(() => {
      this.scrollToBottom();
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim() && !this.selectedFile) return;

    let content: any = {type: 'text', text: this.newMessage};

    if (this.selectedFile) {
      content = {
        type: this.getFileType(this.selectedFile),
        fileUrl: await this.uploadFile(this.selectedFile),
        fileName: this.selectedFile.name,
        fileSize: this.selectedFile.size,
        mimeType: this.selectedFile.type
      };
    }

    this.userService.getUserById(this.auth.currentUser?.uid || '').pipe(
      take(1)
    ).subscribe(user => {
      const message: Message = {
        conversationId: this.chatId,
        writeBy: user.displayName,
        content,
        senderId: this.auth.currentUser?.uid || '',
        timestamp: new Date().toString()
      };

      addDoc(collection(this.firestore, 'messages'), message);
    });


    this.newMessage = '';
    this.selectedFile = undefined;
    setTimeout(() => {

      this.scrollToBottom();
    }, 100);

  }
  scrollToBottom(): void {
    try {
      this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Erreur lors du défilement vers le bas:', err);
    }
  }
  private getFileType(file: File): "image" | "file" | "audio" {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  }

  private async uploadFile(file: File): Promise<string> {
    // Implémentation de l'upload du fichier vers Firebase Storage ou autre
    return "https://example.com/uploaded-file-url"; // Remplacer par l'URL réelle après upload
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
