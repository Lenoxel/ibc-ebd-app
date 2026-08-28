import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Observable, Subscription, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { EbdService } from 'src/app/services/ebd/ebd.service';
import { EBDClassMemberJoinRequest, MemberSearchResult } from 'src/app/types';

@Component({
  selector: 'app-requests-modal',
  templateUrl: './requests-modal.component.html',
  styleUrls: ['./requests-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class RequestsModalComponent implements OnInit, OnDestroy {
  @Input() classId!: number;

  isCreating: boolean = false;

  searchControl = new FormControl('');
  searchResults: MemberSearchResult[] = [];
  isSearching: boolean = false;
  selectedMember: MemberSearchResult | null = null;
  private searchSub!: Subscription;

  requestForm!: FormGroup;

  existingRequests$: Observable<EBDClassMemberJoinRequest[]> = new Observable<
    EBDClassMemberJoinRequest[]
  >();

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private ebdService: EbdService,
  ) {}

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      role: ['student', [Validators.required]],
    });

    this.getExistingRequests();
    this.setupSearch();
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  getExistingRequests() {
    this.existingRequests$ = this.ebdService.getEbdMembersRequestsToJoinClass(
      this.classId,
    );
  }

  setupSearch() {
    this.searchSub = this.searchControl.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => (this.isSearching = true)),
        switchMap((term) => {
          if (!term || term.trim().length < 3) {
            this.searchResults = [];
            return of([]);
          }
          return this.ebdService.searchMembers(term.trim()).pipe(
            catchError(() => {
              return of([]);
            }),
          );
        }),
        tap(() => (this.isSearching = false)),
      )
      .subscribe((results) => {
        this.searchResults = results;
      });
  }

  toggleView(creating: boolean) {
    this.isCreating = creating;
    if (!creating) {
      this.clearSelection();
    }
  }

  selectMember(member: MemberSearchResult) {
    this.selectedMember = member;
    this.searchControl.setValue('', { emitEvent: false });
    this.searchResults = [];
  }

  clearSelection() {
    this.selectedMember = null;
    this.requestForm.reset({ role: 'student' });
    this.searchControl.setValue('', { emitEvent: false });
    this.searchResults = [];
  }

  async submitRequest() {
    if (this.requestForm.invalid || !this.selectedMember) {
      return;
    }

    if (this.selectedMember.current_class?.id === this.classId) {
      const toast = await this.toastController.create({
        message: `${this.selectedMember.name} já está na classe.`,
        duration: 3000,
        color: 'error',
        position: 'top',
      });

      await toast.present();

      return;
    }

    const formValues = this.requestForm.value;

    try {
      await this.ebdService
        .requestMemberToJoinClass(
          this.classId,
          this.selectedMember.id,
          formValues.role,
        )
        .toPromise();

      this.getExistingRequests();
      this.toggleView(false);

      const toast = await this.toastController.create({
        message: 'Solicitação enviada com sucesso!',
        duration: 3000,
        color: 'success',
        position: 'top',
      });

      await toast.present();
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      const responseError = httpError.error;

      const message =
        responseError?.detail ||
        responseError?.message ||
        'Erro ao enviar solicitação.';

      const toast = await this.toastController.create({
        message,
        duration: 5000,
        color: 'danger',
        position: 'top',
      });

      await toast.present();
    }
  }

  getStatusBadgeColor(status: EBDClassMemberJoinRequest['status']): string {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  }

  getMemberTypeLabel(memberType: string): string {
    if (!memberType) return '';

    switch (memberType.toLowerCase()) {
      case 'student':
        return 'Aluno';
      case 'teacher':
      case 'professor':
        return 'Professor';
      case 'secretary':
      case 'secretario':
        return 'Secretário';
      default:
        return memberType;
    }
  }

  getStatusLabel(status: EBDClassMemberJoinRequest['status']): string {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Recusado';
      case 'pending':
      default:
        return 'Em Análise';
    }
  }

  getDecisionStatusLabel(status: EBDClassMemberJoinRequest['status']): string {
    switch (status) {
      case 'approved':
        return 'aprovada';
      case 'rejected':
        return 'recusada';
      default:
        return 'pendente';
    }
  }

  dismiss(data?: any, role?: string) {
    this.modalController.dismiss(data, role);
  }
}
