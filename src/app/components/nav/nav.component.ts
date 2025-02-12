import {Component, inject} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import {ButtonDirective} from 'primeng/button';
import {Auth, signOut} from '@angular/fire/auth';
import {Router} from '@angular/router';
@Component({
  selector: 'app-nav',
  imports: [Menubar, BadgeModule, AvatarModule, InputTextModule, Ripple, CommonModule, ButtonDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  items: MenuItem[] | undefined;
  auth = inject(Auth);
  router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        badge: '3',
        items: [
          {
            label: 'Core',
            icon: 'pi pi-bolt',
            shortcut: '⌘+S',
          },
          {
            label: 'Blocks',
            icon: 'pi pi-server',
            shortcut: '⌘+B',
          },
          {
            separator: true,
          },
          {
            label: 'UI Kit',
            icon: 'pi pi-pencil',
            shortcut: '⌘+U',
          },
        ],
      },
    ];
  }
  signout(){
    signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
